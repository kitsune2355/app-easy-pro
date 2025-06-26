import React, { createContext, useState, useContext } from "react";
import LoadingOverlay from "../components/LoadingOverlay";

interface LoadingContextType {
  show: () => void;
  hide: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  show: () => {},
  hide: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <LoadingContext.Provider value={{ show, hide }}>
      {children}
      {visible && <LoadingOverlay />}
    </LoadingContext.Provider>
  );
};
