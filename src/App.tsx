import React, { useState, useEffect } from "react";
import "./App.css";
import InputField from "./components/InputField";
import TodoList from "./components/TodoList";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { fetchTodos, addTodo, updateTodo } from "./firebaseService";

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [assignedTodos, setAssignedTodos] = useState<any[]>([]);
  const [toBeDoneTodos, setToBeDoneTodos] = useState<any[]>([]);
  const [completedTodos, setCompletedTodos] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todosFromFirebase = await fetchTodos();

        const assigned = todosFromFirebase.filter(todo => todo.assigned && !todo.isDone);
        const toBeDone = todosFromFirebase.filter(todo => !todo.assigned && !todo.isDone);
        const completed = todosFromFirebase.filter(todo => todo.isDone);

        setAssignedTodos(assigned);
        setToBeDoneTodos(toBeDone);
        setCompletedTodos(completed);
      } catch (error) {
        console.error("Error fetching todos: ", error);
      }
    };

    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent, selectedCategory: string) => {
    e.preventDefault();

    if (todo) {
      try {
        const newTodo = {
          todo,
          isDone: selectedCategory === "completed",
          assigned: selectedCategory === "assigned",
        };

        await addTodo(newTodo);

        setTodo("");

        // Fetch updated todos and categorize them
        const todosFromFirebase = await fetchTodos();

        const assigned = todosFromFirebase.filter(todo => todo.assigned && !todo.isDone);
        const toBeDone = todosFromFirebase.filter(todo => !todo.assigned && !todo.isDone);
        const completed = todosFromFirebase.filter(todo => todo.isDone);

        setAssignedTodos(assigned);
        setToBeDoneTodos(toBeDone);
        setCompletedTodos(completed);
      } catch (error) {
        console.error("Error adding todo: ", error);
      }
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceList = source.droppableId === "assigned" ? assignedTodos : source.droppableId === "todos" ? toBeDoneTodos : completedTodos;
    const destinationList = destination.droppableId === "assigned" ? assignedTodos : destination.droppableId === "todos" ? toBeDoneTodos : completedTodos;

    const [movedItem] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, movedItem);

    if (source.droppableId !== destination.droppableId) {
      movedItem.isDone = destination.droppableId === "completed";
      movedItem.assigned = destination.droppableId === "assigned";
      await updateTodo(movedItem.id, movedItem);
    }

    setAssignedTodos([...assignedTodos]);
    setToBeDoneTodos([...toBeDoneTodos]);
    setCompletedTodos([...completedTodos]);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <span className="heading">Trello Clone</span>
        <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
        <TodoList
          todos={toBeDoneTodos}
          setTodos={setToBeDoneTodos}
          assignedTodos={assignedTodos}
          setAssignedTodos={setAssignedTodos}
          completedTodos={completedTodos}
          setCompletedTodos={setCompletedTodos}
        />
      </div>
    </DragDropContext>
  );
};

export default App;
