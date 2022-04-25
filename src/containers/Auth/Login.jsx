import { Component } from "react";
import { connect } from "react-redux";

import { LOGIN } from "../../store/actions/authActions";

import EmailPasswordForm from "../../components/forms/Auth/EmailPasswordForm";

class Login extends Component {
  handleFormSubmit = (data) => {
    // console.log({ data });
    this.props.login(data);
  };

  render() {
    const { loading } = this.props;

    return (
      <EmailPasswordForm
        loading={loading}
        handleFormSubmit={this.handleFormSubmit}
      />
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
