import React, { createContext } from "react";
import { useDisclosure } from "@chakra-ui/react";

const defaultValues = { isOpen: false, onClose: () => {}, onOpen: () => {} };

const DrawerContext = createContext(defaultValues);
DrawerContext.name = "drawer_context";

export default DrawerContext;

export function DrawerContextProvider(props) {
  const { children } = props;
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        onClose,
        onOpen,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}
