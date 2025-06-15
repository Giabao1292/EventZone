// src/context/EventContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getCategories } from "../services/categoryService"; // Giả sử bạn đã có hàm này

export const EventContext = createContext();

export const useEventContext = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [eventData, setEventData] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const handleInputChange = (key, value) => {
    setEventData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onNextStep = () => setStep((s) => s + 1);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data); // Giả sử trả về mảng [{ categoryId, categoryName }]
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <EventContext.Provider
      value={{
        eventData,
        handleInputChange,
        categories,
        loading,
        onNextStep,
        step,
        setStep,
        setCategories,
        setLoading,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
