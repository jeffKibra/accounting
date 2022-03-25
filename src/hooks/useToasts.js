import { useToast } from "@chakra-ui/react";

function useToasts() {
  const toast = useToast();

  const success = (msg) =>
    toast({
      duration: 9000,
      position: "top",
      isClosable: true,
      status: "success",
      variant: "subtle",
      description: msg,
    });

  const info = (msg) =>
    toast({
      duration: 9000,
      position: "top",
      isClosable: true,
      status: "info",
      variant: "subtle",
      description: msg,
    });

  const error = (msg) =>
    toast({
      duration: 9000,
      position: "top",
      isClosable: true,
      status: "error",
      variant: "subtle",
      description: msg,
    });

  const warning = (msg) =>
    toast({
      duration: 9000,
      position: "top",
      isClosable: true,
      status: "warning",
      variant: "subtle",
      description: msg,
    });

  return {
    success,
    info,
    error,
    warning,
  };
}

export default useToasts;
