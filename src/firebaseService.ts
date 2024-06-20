import { ref, get, push, update, remove, onValue } from "firebase/database";
import { db } from "./firebaseConfig";
import { auth } from "./firebaseConfig";

const fetchTodos = (callback: (todos: any[]) => void): (() => void) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    callback([]);
    return () => {};
  }

  const todosRef = ref(db, `users/${userId}/todos`);

  const unsubscribe = onValue(todosRef, (snapshot) => {
    const todos: any[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        todos.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    }
    callback(todos);
  });

  return unsubscribe;
};

const addTodo = async (newTodo: Omit<any, "id">): Promise<void> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;
  const todosRef = ref(db, `users/${userId}/todos`);
  await push(todosRef, newTodo);
};

const updateTodo = async (id: string, updatedTodo: Partial<any>): Promise<void> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;
  const todoRef = ref(db, `users/${userId}/todos/${id}`);
  await update(todoRef, updatedTodo);
};

const deleteTodo = async (id: string): Promise<void> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;
  const todoRef = ref(db, `users/${userId}/todos/${id}`);
  await remove(todoRef);
};

export { fetchTodos, addTodo, updateTodo, deleteTodo };
