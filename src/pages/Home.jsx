import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Navbar from "../pages/Navbar";
import SectionInput from "../Components/SectionInut";
import InputField from "../Components/InputFeild";
import {
  getSections,
  updateSection,
  deleteSection,
  addSection,
  addTodo,
  deleteTodo,
  updateTodo,
  updateSectionOrder,
  updateTodoOrder,
} from "../firebaseService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import "./Home.css";
import useInitializeSections from '../hooks/useInitializeSections'; // Import the custom hook
import {
  ref,
  get,
  update
} from "firebase/database";
import { db } from "../firebaseConfig";
import { auth } from "../firebaseConfig";


const Home = () => {
  const [data, setData] = useState([]);
  const [editSectionId, setEditSectionId] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);
  const [newTodoValue, setNewTodoValue] = useState("");
  const [newTaskInput, setNewTaskInput] = useState({});

  useInitializeSections(getSections, setData, addSection);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sections = await getSections();
        setData(sections || []); // Ensure data is always an array
      } catch (error) {
        console.error("Error fetching sections:", error);
        toast.error("Error fetching sections.");
      }
    };
    fetchData();
  }, []);
  const getUserId = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    return userId;
  };
  const handleEditSection = async (sectionId) => {
    if (newSectionName.trim() === "") return;

    try {
      await updateSection(sectionId, newSectionName);
      setNewSectionName("");
      setEditSectionId(null);
      toast.success("Section updated successfully!");
    } catch (error) {
      console.error("Error updating section:", error);
      toast.error("Error updating section.");
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await deleteSection(sectionId);
      toast.success("Section deleted successfully!");
    } catch (error) {
      console.error("Error deleting section:", error);
      toast.error("Error deleting section.");
    }
  };

  const handleAddTodo = async (sectionId, todo) => {
    if (todo.trim() === "") return;

    try {
      await addTodo(sectionId, todo);
      setNewTaskInput((prev) => ({ ...prev, [sectionId]: "" }));
      toast.success("Todo added successfully!");
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Error adding todo.");
    }
  };

  const handleDeleteTodo = async (sectionId, todoId) => {
    try {
      await deleteTodo(sectionId, todoId);
      toast.success("Todo deleted successfully!");
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Error deleting todo.");
    }
  };

  const handleEditTodo = (sectionId, todoId, currentTodo) => {
    setEditTodoId(todoId);
    setNewTodoValue(currentTodo);
  };

  const handleUpdateTodo = async (sectionId, todoId) => {
    if (newTodoValue.trim() === "") return;

    try {
      await updateTodo(sectionId, todoId, newTodoValue);
      setNewTodoValue("");
      setEditTodoId(null);
      toast.success("Todo updated successfully!");
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Error updating todo.");
    }
  };

  const handleNewTaskChange = (sectionId, value) => {
    setNewTaskInput((prev) => ({ ...prev, [sectionId]: value }));
  };

  const handleAddTaskClick = (sectionId) => {
    handleAddTodo(sectionId, newTaskInput[sectionId] || "");
  };


  const handleDragEnd = async (result) => {
    console.log("Drag end result:", result);

    const { destination, source, draggableId, type } = result;

    if (!destination) {
      console.log("No destination, drag cancelled.");
      return;
    }

    try {
      if (type === "section") {
        console.log("Handling section reordering...");
        const reorderedSections = Array.from(data);
        const [removed] = reorderedSections.splice(source.index, 1);
        reorderedSections.splice(destination.index, 0, removed);

        console.log("Reordered sections:", reorderedSections);

        await updateSectionOrder(
          reorderedSections.map((section) => section.id)
        );

        console.log("Section order updated successfully!");
        setData(reorderedSections);
        toast.success("Section order updated successfully!");
      } else if (type === "todo") {
        console.log("Handling todo reordering or moving...");
        const sourceSectionId = source.droppableId;
        const destinationSectionId = destination.droppableId;

        console.log("Source Section:", sourceSectionId);
        console.log("Destination Section:", destinationSectionId);

        const sourceSection = data.find(
          (section) => section.id === sourceSectionId
        );
        const destinationSection = data.find(
          (section) => section.id === destinationSectionId
        );

        if (!sourceSection || !destinationSection) {
          console.error("Source or destination section not found.");
          return;
        }

        if (sourceSectionId === destinationSectionId) {
          console.log("Reordering todos within the same section...");
        
          // Reorder todos based on drag-and-drop
          const reorderedTodos = Array.from(Object.values(sourceSection.todos || {}));
          const [removed] = reorderedTodos.splice(source.index, 1);
          reorderedTodos.splice(destination.index, 0, removed);
        
          console.log("Reordered todos:", reorderedTodos);
        
          // Optimistically update the state with the reordered todos
          setData((prevData) =>
            prevData.map((section) =>
              section.id === sourceSectionId
                ? {
                    ...section,
                    todos: reorderedTodos.reduce((acc, todo) => {
                      acc[todo.id] = todo;
                      return acc;
                    }, {}),
                  }
                : section
            )
          );
        
          // Update the order in Firebase
          try {
            await updateTodoOrder(sourceSectionId, reorderedTodos.map(todo => todo.id));
            console.log("Todo order updated successfully!");
            toast.success("Todo order updated successfully!");
          } catch (error) {
            console.error("Error updating todo order:", error);
            toast.error("Failed to update todo order. Please try again.");
            
            // Optionally, fetch the latest data from Firebase to reset the state
            const sectionSnapshot = await get(ref(db, `users/${getUserId()}/sections/${sourceSectionId}`));
            const updatedSection = sectionSnapshot.val();
            const sortedTodos = Object.values(updatedSection.todos || {}).sort((a, b) => a.order - b.order);
        
            setData((prevData) =>
              prevData.map((section) =>
                section.id === sourceSectionId
                  ? {
                      ...section,
                      todos: sortedTodos.reduce((acc, todo) => {
                        acc[todo.id] = todo;
                        return acc;
                      }, {}),
                    }
                  : section
              )
            );
          }
        }
        
        else {
          console.log("Handling todo moving...");

          // Extract the todo being dragged
          const { [draggableId]: removedTodo, ...newSourceTodos } = sourceSection.todos || {};
          console.log("Drag ID:", draggableId);

          if (!removedTodo) {
            console.error("Todo not found in source section.");
            return;
          }

          // Update IDs in the source section
          const updatedSourceTodos = Object.keys(newSourceTodos).reduce((acc, id) => {
            const todo = newSourceTodos[id];
            acc[id] = todo.order > removedTodo.order
              ? { ...todo, order: todo.order - 1 }
              : todo;
            return acc;
          }, {});

          // Get the current todos in the destination section
          const destinationTodos = destinationSection.todos || {};

          // Determine the new order for the moved todo
          const highestOrder = Object.values(destinationTodos).reduce(
            (maxOrder, todo) => Math.max(maxOrder, todo.order),
            -1
          );
          let newOrder = highestOrder + 1;

          // Ensure the newTodoId is unique
          let newTodoId = `${newOrder}`;
          while (destinationTodos[newTodoId]) {
            newOrder += 1;
            newTodoId = `${newOrder}`;
          }

          // Prepare the todo data to be added to the destination section
          const newTodoData = {
            ...removedTodo,
            order: newOrder,
            id: newTodoId
          };

          // Add the moved todo to the destination section
          const newDestinationTodos = {
            ...destinationTodos,
            [newTodoId]: newTodoData
          };


          console.log("Updated Source Todos:", updatedSourceTodos);
          console.log("New Destination Todos:", newDestinationTodos);
          window.location.reload()

          // Optimistically update local state immediately
          setData((prevData) => {
            const updatedData = prevData.map((section) =>
              section.id === sourceSectionId
                ? { ...section, todos: updatedSourceTodos }
                : section.id === destinationSectionId
                  ? { ...section, todos: newDestinationTodos }
                  : section
            );
            return updatedData;
          });

          try {
            // Firebase updates
            const sourceUpdates = {};
            Object.keys(updatedSourceTodos).forEach((id) => {
              sourceUpdates[`users/${getUserId()}/sections/${sourceSectionId}/todos/${id}`] = updatedSourceTodos[id];
            });
            sourceUpdates[`users/${getUserId()}/sections/${sourceSectionId}/todos/${draggableId}`] = null;

            const destinationUpdates = {
              [`users/${getUserId()}/sections/${destinationSectionId}/todos/${newTodoId}`]: newTodoData
            };

            // Perform Firebase update
            await update(ref(db), { ...sourceUpdates, ...destinationUpdates });

            console.log("Todo moved and orders updated successfully!");
          } catch (error) {
            console.error("Error moving todo:", error);
            toast.error("Error moving todo. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error updating order. Please try again.");
    }
  };




  return (
    <>
      <Navbar />
      <div className="container my-4">
        <h1 style={{ color: "white" }} className="my-4 tasks">
          Tasks Board
        </h1>
        <div className="row mb-4">
          <SectionInput />
        </div>
        <div className="row mb-4">
          <InputField />
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="section" type="section">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="row"
              >
                <h2 style={{ color: "white" }} className="mb-4 section-heading">
                  Sections
                </h2>

                {data && data.length > 0 ? (
                  data.map((section, index) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="col-md-12 mt-5"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="card">
                            <div className="card-body">
                              {editSectionId === section.id ? (
                                <>
                                  <input
                                    type="text"
                                    value={newSectionName}
                                    onChange={(e) =>
                                      setNewSectionName(e.target.value)
                                    }
                                    placeholder="New section name"
                                    className="form-control mb-2"
                                  />
                                  <div className="d-flex justify-content-between">
                                    <button
                                      className="btn btn-success"
                                      onClick={() =>
                                        handleEditSection(section.id)
                                      }
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="btn btn-secondary"
                                      onClick={() => setEditSectionId(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <h5 className="card-title">{section.name}</h5>
                                  <div className="d-flex justify-content-between mb-2">
                                    <button
                                      className="btn btn-primary"
                                      onClick={() => setEditSectionId(section.id)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-danger"
                                      onClick={() => handleDeleteSection(section.id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                  <Droppable
                                    droppableId={section.id}
                                    type="todo"
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="list-group"
                                      >
                                        {section.todos &&
                                          Object.keys(section.todos).map(
                                            (todoId, index) => (
                                              <Draggable
                                                key={todoId}
                                                draggableId={todoId}
                                                index={index}
                                              >
                                                {(provided) => (
                                                  <div
                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                  >
                                                    {editTodoId === todoId ? (
                                                      <>
                                                        <input
                                                          type="text"
                                                          value={newTodoValue}
                                                          onChange={(e) =>
                                                            setNewTodoValue(e.target.value)
                                                          }
                                                          placeholder="Update todo"
                                                          className="form-control mb-2"
                                                        />
                                                        <div className="d-flex justify-content-between">
                                                          <button
                                                            className="btn btn-success"
                                                            onClick={() =>
                                                              handleUpdateTodo(
                                                                section.id,
                                                                todoId
                                                              )
                                                            }
                                                          >
                                                            Save
                                                          </button>
                                                          <button
                                                            className="btn btn-secondary"
                                                            onClick={() =>
                                                              setEditTodoId(null)
                                                            }
                                                          >
                                                            Cancel
                                                          </button>
                                                        </div>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <span>
                                                          {section.todos[todoId]?.text || "Todo not found"} {/* Access the 'text' property */}
                                                        </span>
                                                        <div className="d-flex justify-content-end">
                                                          <button
                                                            className="btn btn-warning btn-sm mx-2"
                                                            onClick={() =>
                                                              handleEditTodo(
                                                                section.id,
                                                                todoId,
                                                                section.todos[todoId]?.text
                                                              )
                                                            }
                                                          >
                                                            <FaPencilAlt />
                                                          </button>
                                                          <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() =>
                                                              handleDeleteTodo(
                                                                section.id,
                                                                todoId
                                                              )
                                                            }
                                                          >
                                                            <FaTrash />
                                                          </button>
                                                        </div>
                                                      </>
                                                    )}
                                                  </div>
                                                )}
                                              </Draggable>
                                            )
                                          )}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                  <div className="input-group mt-2">
                                    <input
                                      type="text"
                                      value={newTaskInput[section.id] || ""}
                                      onChange={(e) =>
                                        handleNewTaskChange(section.id, e.target.value)
                                      }
                                      placeholder="New todo"
                                      className="form-control"
                                    />
                                    <button
                                      className="btn btn-primary"
                                      onClick={() => handleAddTaskClick(section.id)}
                                    >
                                      Add Todo
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <h1 style={{ color: "white", textAlign: "center" }}>No sections available.</h1>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
};

export default Home;