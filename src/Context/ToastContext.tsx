import React, { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toast = useRef(null);

  const showToast = (state, message) => {
    toast.current.show({
      severity: state,
      summary: state,
      detail: message,
      life: 1500, 
    });
  };

  return (
    <ToastContext.Provider value={showToast}>
      <Toast ref={toast} position="bottom-left" />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const showToast = useContext(ToastContext);
  return showToast;
};
