import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { warning, info, success, error } from "../../store/slices/toastSlice";

function Toasts(props) {
  const {
    infoMsg,
    successMsg,
    errorMsg,
    warningMsg,
    title,
    toastInfo,
    toastWarning,
    toastError,
    toastSuccess,
  } = props;
  const toast = useToast();
  // console.log({ props });

  //info
  useEffect(() => {
    if (infoMsg) {
      toast({
        duration: 5000,
        isClosable: true,
        position: "top",
        status: "info",
        variant: "subtle",
        ...(title ? { title } : {}),
        description: infoMsg,
        onCloseComplete: () => toastInfo(null),
      });
    }
  }, [toast, infoMsg, title, toastInfo]);

  //success
  useEffect(() => {
    if (successMsg) {
      toast({
        duration: 5000,
        isClosable: true,
        position: "top",
        status: "success",
        variant: "subtle",
        ...(title ? { title } : {}),
        description: successMsg,
        onCloseComplete: () => toastSuccess(null),
      });
    }
  }, [toast, successMsg, title, toastSuccess]);

  //error
  useEffect(() => {
    if (errorMsg) {
      toast({
        duration: 5000,
        isClosable: true,
        position: "top",
        status: "error",
        variant: "subtle",
        ...(title ? { title } : {}),
        description: errorMsg,
        onCloseComplete: () => toastError(null),
      });
    }
  }, [toast, errorMsg, title, toastError]);

  //warning
  useEffect(() => {
    if (warningMsg) {
      toast({
        duration: 5000,
        isClosable: true,
        position: "top",
        status: "warning",
        variant: "subtle",
        ...(title ? { title } : {}),
        description: warningMsg,
        onCloseComplete: () => toastWarning(null),
      });
    }
  }, [toast, warningMsg, title, toastWarning]);

  return null;
}

Toasts.propTypes = {
  errorMsg: PropTypes.node,
  infoMsg: PropTypes.node,
  successMsg: PropTypes.node,
  warningMsg: PropTypes.node,
  title: PropTypes.node,
};

function mapStateToProps(state) {
  const { info, warning, error, success } = state.toastReducer;

  return {
    infoMsg: info,
    warningMsg: warning,
    errorMsg: error,
    successMsg: success,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toastError: (message) => dispatch(error(message)),
    toastInfo: (message) => dispatch(info(message)),
    toastSuccess: (message) => dispatch(success(message)),
    toastWarning: (message) => dispatch(warning(message)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Toasts);
