import { useContext } from "react";
import { TodoSelection } from "../../pages/home/home";

export const useTodoContext = () => {
  const context = useContext(TodoSelection);

  if (!context) {
    throw new Error(
      "useTodoSelection must be used within TodoSelectionProvider",
    );
  }

  return context;
};
