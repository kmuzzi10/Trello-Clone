import React, { useRef, useState } from "react";
import "./styles.css";

interface Props {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (e: React.FormEvent, selectedCategory: string) => void;
}

const InputField: React.FC<Props> = ({ todo, setTodo, handleAdd }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

  return (
    <form
      className="input"
      onSubmit={(e) => {
        handleAdd(e, selectedCategory);
        inputRef.current?.blur();
      }}
    >
      <input
        type="text"
        placeholder="Enter a Task"
        value={todo}
        ref={inputRef}
        onChange={(e) => setTodo(e.target.value)}
        className="input__box"
      />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="input__select"
      >
        <option value="assigned">Assigned Tasks</option>
        <option value="todos">To Be Done</option>
        <option value="completed">Completed Tasks</option>
      </select>
      <button type="submit" className="input__submit">
        GO
      </button>
    </form>
  );
};

export default InputField;
