import { useContext } from "react";
import { TodoSelection } from "./home";

export const useTodoContext = () => {
  const context = useContext(TodoSelection);

  if (!context) {
    throw new Error(
      "useTodoSelection must be used within TodoSelectionProvider",
    );
  }

  return context;
};
