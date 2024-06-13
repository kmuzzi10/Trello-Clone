import React from "react";
import SingleTodo from "./SingleTodo";
import { Droppable } from "react-beautiful-dnd";

interface Props {
  todos: Array<{
    id: string;
    todo: string;
    isDone: boolean;
  }>;
  setTodos: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    todo: string;
    isDone: boolean;
  }>>>;
  assignedTodos: Array<{
    id: string;
    todo: string;
    isDone: boolean;
  }>;
  setAssignedTodos: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    todo: string;
    isDone: boolean;
  }>>>;
  completedTodos: Array<{
    id: string;
    todo: string;
    isDone: boolean;
  }>;
  setCompletedTodos: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    todo: string;
    isDone: boolean;
  }>>>;
}

const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  assignedTodos,
  setAssignedTodos,
  completedTodos,
  setCompletedTodos,
}) => {
  console.log("Rendering TodoList with todos:", todos, "assignedTodos:", assignedTodos, "completedTodos:", completedTodos);

  return (
    <div className="container">
      <Droppable droppableId="assigned">
        {(provided, snapshot) => (
          <div
            className={`todos ${snapshot.isDraggingOver ? "dragactive" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <span className="todos__heading">Assigned Tasks</span>
            {assignedTodos.map((todo, index) => (
              <SingleTodo
                index={index}
                todos={assignedTodos} // <-- Corrected prop name
                todo={todo}
                key={todo.id}
                setTodos={setAssignedTodos} // <-- Corrected prop name
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="todos">
        {(provided, snapshot) => (
          <div
            className={`todos ${snapshot.isDraggingOver ? "dragactive" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <span className="todos__heading">To Be Done</span>
            {todos.map((todo, index) => (
              <SingleTodo
                index={index}
                todos={todos} // <-- Corrected prop name
                todo={todo}
                key={todo.id}
                setTodos={setTodos} // <-- Corrected prop name
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="completed">
        {(provided, snapshot) => (
          <div
            className={`todos ${snapshot.isDraggingOver ? "dragcomplete" : "remove"}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <span className="todos__heading">Completed Tasks</span>
            {completedTodos.map((todo, index) => (
              <SingleTodo
                index={index}
                todos={completedTodos} // <-- Corrected prop name
                todo={todo}
                key={todo.id}
                setTodos={setCompletedTodos} // <-- Corrected prop name
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TodoList;
