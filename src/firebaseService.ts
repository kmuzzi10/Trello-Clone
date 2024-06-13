import { ref, get, push, update, remove } from "firebase/database";
import { db } from "./firebaseConfig";

const fetchTodos = async (): Promise<any[]> => {
    const todosRef = ref(db, 'todos');
    const todosSnapshot = await get(todosRef);

    const todos: any[] = [];
    if (todosSnapshot.exists()) {
        todosSnapshot.forEach((childSnapshot) => {
            todos.push({
                id: childSnapshot.key,
                todo: childSnapshot.val().todo,
                isDone: childSnapshot.val().isDone,
                assigned: childSnapshot.val().assigned
            });
        });
    }

    return todos;
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
