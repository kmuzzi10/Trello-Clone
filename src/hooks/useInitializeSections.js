import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const initializeDefaultSections = async (sectionsData, addSection) => {
  const existingSections = Object.values(sectionsData).map(
    (section) => section.name
  );

  try {
    if (!existingSections.includes("Assigned Task")) {
      await addSection("Assigned Task");
    }
    if (!existingSections.includes("Processing")) {
      await addSection("Processing");
    }
    if (!existingSections.includes("To Be Completed")) {
      await addSection("To Be Completed");
    }
    if (!existingSections.includes("Completed Tasks")) {
      await addSection("Completed Tasks");
    }
    toast.success('Default sections initialized successfully!');
  } catch (error) {
    console.error('Error initializing default sections:', error);
    toast.error('Error initializing default sections.');
  }
};

const useInitializeSections = (getSections, setData, addSection) => {
  const hasInitialized = useRef(false);

  useEffect(() => {
    let isMounted = true;

    getSections((sectionsData) => {
      const sectionsArray = Object.keys(sectionsData).map((sectionId) => ({
        id: sectionId,
        ...sectionsData[sectionId],
      }));
      setData(sectionsArray);

      if (isMounted && !hasInitialized.current) {
        hasInitialized.current = true;
        initializeDefaultSections(sectionsData, addSection);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [getSections, setData, addSection]);
};

export default useInitializeSections;
