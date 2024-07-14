import React from "react";
import { Draggable } from "@dnd-kit/sortable";
import SortableTodo from "./SortableTodo";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

const SortableSection = ({
  id,
  index,
  section,
  editSectionId,
  setEditSectionId,
  newSectionName,
  setNewSectionName,
  handleEditSection,
  handleDeleteSection,
  editTodoId,
  setEditTodoId,
  newTodoValue,
  setNewTodoValue,
  handleEditTodo,
  handleUpdateTodo,
  handleDeleteTodo,
  newTaskInput,
  handleNewTaskChange,
  handleAddTaskClick,
}) => (
  <Draggable id={id} index={index}>
    <div className="col-md-4 mb-4" style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <div className="card section-card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            {editSectionId === section.id ? (
              <div className="input-group">
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="form-control"
                />
                <button
                  className="btn btn-success"
                  onClick={() => handleEditSection(section.id)}
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
            ) : (
              <>
                <h5 className="card-title">{section.name}</h5>
                <div>
                  <FaPencilAlt
                    className="icon-hover"
                    style={{ cursor: "pointer", marginRight: "8px" }}
                    onClick={() => setEditSectionId(section.id)}
                  />
                  <FaTrash
                    className="icon-hover"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteSection(section.id)}
                  />
                </div>
              </>
            )}
          </div>
          <ul className="list-group list-group-flush">
            <SortableContext
              items={Object.keys(section.todos)}
              strategy={verticalListSortingStrategy}
            >
              {Object.entries(section.todos).map(([todoId, todo], index) => (
                <SortableTodo
                  key={todoId}
                  id={todoId}
                  index={index}
                  todo={todo}
                  sectionId={section.id}
                  editTodoId={editTodoId}
                  setEditTodoId={setEditTodoId}
                  newTodoValue={newTodoValue}
                  setNewTodoValue={setNewTodoValue}
                  handleEditTodo={handleEditTodo}
                  handleUpdateTodo={handleUpdateTodo}
                  handleDeleteTodo={handleDeleteTodo}
                />
              ))}
            </SortableContext>
          </ul>
        </div>
        <div className="card-footer">
          <div className="input-group">
            <input
              type="text"
              value={newTaskInput[section.id] || ""}
              onChange={(e) => handleNewTaskChange(section.id, e.target.value)}
              className="form-control"
              placeholder="New Todo"
            />
            <button
              className="btn btn-primary"
              onClick={() => handleAddTaskClick(section.id)}
            >
              Add Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  </Draggable>
);

export default SortableSection;
