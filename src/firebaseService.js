import {
  ref,
  get,
  push,
  set,
  update,
  remove,
  onValue,
} from "firebase/database";
import { db } from "./firebaseConfig";
import { auth } from "./firebaseConfig";

const getUserId = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not authenticated");
  return userId;
};

export const addSection = async (sectionName) => {
  const userId = getUserId();
  const sectionsRef = ref(db, `users/${userId}/sections`);
  const newSectionRef = push(sectionsRef);

  try {
    await set(newSectionRef, { name: sectionName, todos: [], order: 0 });
    console.log("Section added successfully");
  } catch (error) {
    console.error("Error adding section:", error);
  }
};

export const getSections = (callback) => {
  if (typeof callback !== "function") {
    throw new Error("Callback must be a function");
  }

  const userId = getUserId();
  const sectionsRef = ref(db, `users/${userId}/sections`);

  const unsubscribe = onValue(
    sectionsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const sectionsData = snapshot.val();
        const orderedSections = Object.keys(sectionsData)
          .sort(
            (a, b) =>
              (sectionsData[a].order || 0) - (sectionsData[b].order || 0)
          )
          .reduce((acc, sectionId) => {
            acc[sectionId] = sectionsData[sectionId];
            return acc;
          }, {});
        callback(orderedSections);
      } else {
        callback({});
      }
    },
    (error) => {
      console.error("Error reading sections:", error);
      callback({});
    }
  );

  return unsubscribe;
};

export const updateSection = async (sectionId, newName) => {
  const userId = getUserId();
  const sectionRef = ref(db, `users/${userId}/sections/${sectionId}`);

  try {
    await update(sectionRef, { name: newName });
    console.log("Section updated successfully");
  } catch (error) {
    console.error("Error updating section:", error);
  }
};

export const deleteSection = async (sectionId) => {
  const userId = getUserId();
  const sectionRef = ref(db, `users/${userId}/sections/${sectionId}`);

  try {
    await remove(sectionRef);
    console.log("Section deleted successfully");
  } catch (error) {
    console.error("Error deleting section:", error);
  }
};

export const addTodo = async (sectionId, todoText) => {
  const userId = getUserId();
  const sectionRef = ref(db, `users/${userId}/sections/${sectionId}/todos`);

  try {
    // Fetch current todos to determine the highest order value
    const snapshot = await get(sectionRef);
    const currentTodos = snapshot.exists() ? snapshot.val() : [];

    // Determine the highest current order value
    const maxOrder = currentTodos.length > 0 ? Math.max(...currentTodos.map(todo => todo.order)) : -1;

    // Create a new todo with a unique ID and next order value
    const newTodoRef = push(sectionRef); // Generate a unique key for the new todo
    const newTodoId = newTodoRef.key;
    const newTodo = {
      id: newTodoId,
      text: todoText,
      order: maxOrder + 1 // Next order value
    };

    // Add the new todo to the array
    currentTodos.push(newTodo);

    // Update the section with the new todos array
    await set(sectionRef, currentTodos);

    console.log("Todo added successfully with ID:", newTodoId);
  } catch (error) {
    console.error("Error adding todo:", error);
  }
};

export const getTodoById = async (sectionId, todoId) => {
  const userId = getUserId();
  console.log(sectionId,todoId)
  const todoRef = ref(db, `users/${userId}/sections/${sectionId}/todos/${todoId}`);

  try {
    const snapshot = await get(todoRef);
    if (snapshot.exists()) {
      return snapshot.val(); // Return the todo object
    } else {
      console.log("Todo not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching todo:", error);
    throw error; // Rethrow error to handle it in the calling code
  }
};



export const updateTodo = async (sectionId, id, updatedTodo) => {
  const userId = getUserId();
  const todoRef = ref(db, `users/${userId}/sections/${sectionId}/todos/${id}`);

  try {
    await update(todoRef, { text: updatedTodo });
    console.log("Todo updated successfully");
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

export const deleteTodo = async (sectionId, id) => {
  const userId = getUserId();
  const todoRef = ref(db, `users/${userId}/sections/${sectionId}/todos/${id}`);

  try {
    await remove(todoRef);
    console.log("Todo deleted successfully");
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

export const updateSectionOrder = async (orderedSectionIds) => {
  const userId = getUserId();
  const sectionsRef = ref(db, `users/${userId}/sections`);

  try {
    const sectionsSnapshot = await get(sectionsRef);
    if (sectionsSnapshot.exists()) {
      const sectionsData = sectionsSnapshot.val();
      const orderedSections = {};

      orderedSectionIds.forEach((sectionId, index) => {
        orderedSections[sectionId] = {
          ...sectionsData[sectionId],
          order: index,
        };
      });

      await set(sectionsRef, orderedSections);
      console.log("Sections order updated successfully");
    }
  } catch (error) {
    console.error("Error updating section order:", error);
  }
};

export const addTodoOrder = async (sectionId, todo) => {
  const userId = getUserId();
  const todoRef = ref(db, `users/${userId}/sections/${sectionId}/todos/${todo.id}`);

  try {
    await set(todoRef, todo);
    console.log("Todo updated successfully with ID:", todo.id);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};


export const updateTodoOrder = async (sectionId, orderedTodoIds) => {
  const userId = getUserId();
  const sectionRef = ref(db, `users/${userId}/sections/${sectionId}/todos`);

  try {
    // Fetch the current todos
    const sectionSnapshot = await get(sectionRef);
    const currentTodos = sectionSnapshot.exists() ? sectionSnapshot.val() : [];

    // Create a new array with updated order
    const todosArray = orderedTodoIds.map((todoId, index) => {
      const todo = currentTodos.find(t => t.id === todoId);
      if (todo) {
        return { ...todo, order: index };
      }
      return null;
    }).filter(todo => todo !== null);

    // Update the section with the new todos array
    await set(sectionRef, todosArray);

    console.log("Todo order updated successfully in Firebase.");
  } catch (error) {
    console.error("Error updating todo order in Firebase:", error);
  }
};



export const updateTodoSection = async (todoId, newSectionId) => {
  const userId = getUserId();
  const sectionsRef = ref(db, `users/${userId}/sections`);

  try {
    // Fetch all sections
    const sectionsSnapshot = await get(sectionsRef);
    if (!sectionsSnapshot.exists()) throw new Error("Sections not found");

    const sectionsData = sectionsSnapshot.val();
    let currentSectionId = null;
    let todoData = null;
    let newOrder = 0;

    // Find the current section of the todo and its data
    for (const [sectionId, section] of Object.entries(sectionsData)) {
      if (section.todos && section.todos[todoId]) {
        currentSectionId = sectionId;
        todoData = section.todos[todoId];
        break;
      }
    }

    // If todo not found in any section, throw error
    if (!currentSectionId || !todoData)
      throw new Error("Todo not found in any section");

    // Remove todo from current section
    await remove(
      ref(db, `users/${userId}/sections/${currentSectionId}/todos/${todoId}`)
    );

    // Determine new order based on existing todos in new section
    if (sectionsData[newSectionId] && sectionsData[newSectionId].todos) {
      const todosInNewSection = sectionsData[newSectionId].todos;
      const highestOrder = Object.keys(todosInNewSection).reduce(
        (maxOrder, key) => {
          return Math.max(maxOrder, todosInNewSection[key].order);
        },
        0
      );
      newOrder = highestOrder + 1;
    }

    // Set todo in new section with updated order
    const newTodosRef = ref(
      db,
      `users/${userId}/sections/${newSectionId}/todos/${todoId}`
    );
    await set(newTodosRef, { ...todoData, order: newOrder });

    console.log("Todo moved successfully");
  } catch (error) {
    console.error("Error moving todo:", error);
  }
};

// Fetch sections with ordered todos
export const fetchSectionWithTodos = async () => {
  const userId = getUserId();
  const sectionsRef = ref(db, `users/${userId}/sections`);
  
  try {
    const snapshot = await get(sectionsRef);
    if (!snapshot.exists()) {
      console.log("No sections found.");
      return [];
    }

    const sections = snapshot.val();

    // Convert sections object to an array and format todos as an array
    const formattedSections = Object.values(sections).map(section => {
      // Convert todos object to an array and sort by order
      const todosArray = Array.isArray(section.todos) ? 
        section.todos.sort((a, b) => a.order - b.order) : [];
      
      return {
        ...section,
        todos: todosArray
      };
    });

    console.log("Formatted sections with todos:", formattedSections);
    return formattedSections;
  } catch (error) {
    console.error("Error fetching and formatting sections:", error);
    return [];
  }
};


