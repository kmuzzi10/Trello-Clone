import React, { useState, useEffect } from 'react';
import { addTodo, getSections } from '../firebaseService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './InputFeild.css'; // Import the CSS file for styling
import Button63 from './Button63'; // Import the Button63 component

const InputField = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [sections, setSections] = useState({});

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionsData = await getSections((sectionsData) => {
          setSections(sectionsData);
          if (Object.keys(sectionsData).length > 0) {
            setSelectedOption(Object.keys(sectionsData)[0]);
          }
        });
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

    fetchSections();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleButtonClick = async () => {
    if (inputValue && selectedOption) {
      try {
        await addTodo(selectedOption, inputValue);
        setInputValue('');
        toast.success('Todo added successfully!');
      } catch (error) {
        console.error('Error adding task:', error);
        toast.error('Error adding todo.');
      }
    } else {
      toast.info('Please enter a task and select a section');
    }
  };

  return (
    <div className="input-field-container">
      <input 
        type="text" 
        value={inputValue} 
        onChange={handleInputChange} 
        className="input-field form-control" 
        placeholder="Type Tasks Here"
      />
      <select 
        value={selectedOption} 
        onChange={handleSelectChange} 
        className="dropdown-field"
      >
        {Object.entries(sections).map(([sectionId, section]) => (
          <option key={sectionId} value={sectionId}>{section.name}</option>
        ))}
      </select>
      
      <Button63 onClick={handleButtonClick}>
        Add Todo
      </Button63>
    </div>
  );
};

export default InputField;
