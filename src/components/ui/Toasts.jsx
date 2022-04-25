import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import PropTypes from "prop-types";

function Toasts(props) {
  const { info, success, error, warning, title } = props;
  const toast = useToast();

  //info
  useEffect(() => {
    if (info) {
      toast({
        duration: 5000,
        isClosable: true,
        position: "top",
        status: "info",
        variant: "subtle",
        ...(title ? { title } : {}),
        description: info,
      });
    }
  }, [toast, info, title]);

  //success
  useEffect(() => {
    if (success) {
      toast({
        duration: 5000,
        isClosable: true,
        position: "top",
        status: "success",
        variant: "subtle",
        ...(title ? { title } : {}),
        description: success,
      });
    }
  }, [toast, success, title]);

  //error
  useEffect(() => {
    if (error) {
      toast({
        duration: 5000,
        isClosable: true,
        position: "top",
        status: "error",
        variant: "subtle",
        ...(title ? { title } : {}),
        description: error,
      });
    }
  }, [toast, error, title]);

  //warning
  useEffect(() => {
    if (warning) {
      toast({
        duration: 5000,
        isClosable: true,
        position: "top",
        status: "warning",
        variant: "subtle",
        ...(title ? { title } : {}),
        description: warning,
      });
    }
  }, [toast, warning, title]);

  return null;
}

Toasts.propTypes = {
  error: PropTypes.string,
  info: PropTypes.string,
  success: PropTypes.string,
  warning: PropTypes.string,
  title: PropTypes.string,
};

export default Toasts;
