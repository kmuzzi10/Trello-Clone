import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import InputField from "./components/InputField";
import TodoList from "./components/TodoList";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { fetchTodos, addTodo, updateTodo } from "./firebaseService";
import Navbar from "./components/Navbar";
import { auth } from "./firebaseConfig";
import Signup from "../src/components/Signup";
import Login from "../src/components/Login";
import { onAuthStateChanged } from "firebase/auth";

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [assignedTodos, setAssignedTodos] = useState<any[]>([]);
  const [toBeDoneTodos, setToBeDoneTodos] = useState<any[]>([]);
  const [completedTodos, setCompletedTodos] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribeTodos = fetchTodos((todos) => {
      const assigned = todos.filter((todo) => todo.assigned && !todo.isDone);
      const toBeDone = todos.filter((todo) => !todo.assigned && !todo.isDone);
      const completed = todos.filter((todo) => todo.isDone);

      setAssignedTodos(assigned);
      setToBeDoneTodos(toBeDone);
      setCompletedTodos(completed);
    });

    return () => unsubscribeTodos();
  }, [user]);

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

    const sourceList =
      source.droppableId === "assigned"
        ? assignedTodos
        : source.droppableId === "todos"
        ? toBeDoneTodos
        : completedTodos;
    const destinationList =
      destination.droppableId === "assigned"
        ? assignedTodos
        : destination.droppableId === "todos"
        ? toBeDoneTodos
        : completedTodos;

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

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Navbar />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="App">
          <span className="heading">Tasks List</span>
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
    </Router>
  );
};

export default App;
