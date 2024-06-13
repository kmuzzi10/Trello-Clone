import React, { useEffect, useState, useRef } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";
import { updateTodo, deleteTodo } from "../firebaseService";

interface SingleTodoProps {
  index: number;
  todo: {
    id: string;
    todo: string;
    isDone: boolean;
  };
  todos: {
    id: string;
    todo: string;
    isDone: boolean;
  }[];
  setTodos: React.Dispatch<React.SetStateAction<{
    id: string;
    todo: string;
    isDone: boolean;
  }[]>>;
}

const SingleTodo: React.FC<SingleTodoProps> = ({ index, todo, todos, setTodos }) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<string>(todo.todo);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (edit) {
      inputRef.current?.focus();
    }
  }, [edit]);

  const handleEdit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    try {
      await updateTodo(id, { todo: editTodo });
      setTodos(todos.map((item) => (item.id === id ? { ...item, todo: editTodo } : item)));
      setEdit(false);
    } catch (error) {
      console.error("Error updating todo: ", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  const handleDone = async (id: string) => {
    try {
      await updateTodo(id, { isDone: !todo.isDone });
      setTodos(todos.map((item) => (item.id === id ? { ...item, isDone: !item.isDone } : item)));
    } catch (error) {
      console.error("Error updating todo: ", error);
    }
  };

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <form
          onSubmit={(e) => handleEdit(e, todo.id)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`todos__single ${snapshot.isDragging ? "drag" : ""}`}
        >
          {edit ? (
            <input
              value={editTodo}
              onChange={(e) => setEditTodo(e.target.value)}
              className="todos__single--text"
              ref={inputRef}
            />
          ) : todo.isDone ? (
            <s className="todos__single--text">{todo.todo}</s>
          ) : (
            <span className="todos__single--text">{todo.todo}</span>
          )}
          <div>
            <span
              className="icon"
              onClick={() => {
                if (!edit && !todo.isDone) {
                  setEdit(true);
                }
              }}
            >
              <AiFillEdit />
            </span>
            <span className="icon" onClick={() => handleDelete(todo.id)}>
              <AiFillDelete />
            </span>
            <span className="icon" onClick={() => handleDone(todo.id)}>
              <MdDone />
            </span>
          </div>
        </form>
      )}
    </Draggable>
  );
};

export default SingleTodo;
