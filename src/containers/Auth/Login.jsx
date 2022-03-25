import { Component } from "react";
import { Box } from "@chakra-ui/react";
import { connect } from "react-redux";

import { LOGIN } from "../../store/actions/authActions";

// import { AuthContext } from "../../store/contexts/auth/authContext";

import EmailPasswordForm from "../../components/forms/Auth/EmailPasswordForm";

class Login extends Component {
  componentDidUpdate(prevProps) {
    console.log({ prevProps });
  }

  handleFormSubmit = (data) => {
    // console.log({ data });
    this.props.login(data);
  };

  render() {
    const { loading } = this.props;
    console.log({ loading });
    return (
      <Box
        w="full"
        minH="full"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <EmailPasswordForm
          loading={loading}
          handleFormSubmit={this.handleFormSubmit}
        />
      </Box>
    );
  }
}

function mapStateToProps(state) {
  const { loading, error } = state.authReducer;
  return { loading, error };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (data) => dispatch({ type: LOGIN, data }),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
