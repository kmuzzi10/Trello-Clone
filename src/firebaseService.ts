import { ref, get, push, update, remove, onValue } from "firebase/database";
import { db } from "./firebaseConfig";

const fetchTodos = (callback: (todos: any[]) => void): (() => void) => {
  const todosRef = ref(db, 'todos');

  const unsubscribe = onValue(todosRef, (snapshot) => {
    const todos: any[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        todos.push({
          id: childSnapshot.key,
          todo: childSnapshot.val().todo,
          isDone: childSnapshot.val().isDone,
          assigned: childSnapshot.val().assigned
        });
      });
    }
    callback(todos);
  });

  // Return the unsubscribe function to detach the listener when no longer needed
  return unsubscribe;
};

const addTodo = async (newTodo: Omit<any, "id">): Promise<void> => {
  const todosRef = ref(db, 'todos');
  await push(todosRef, newTodo);
};

const updateTodo = async (id: string, updatedTodo: Partial<any>): Promise<void> => {
  const todoRef = ref(db, `todos/${id}`);
  await update(todoRef, updatedTodo);
};

const deleteTodo = async (id: string): Promise<void> => {
  const todoRef = ref(db, `todos/${id}`);
  await remove(todoRef);
};

export { fetchTodos, addTodo, updateTodo, deleteTodo };
