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
    const { loading, action } = this.props;

    return (
      <EmailPasswordForm
        loading={loading && action === LOGIN}
        handleFormSubmit={this.handleFormSubmit}
      />
    );
  }
}

function mapStateToProps(state) {
  const { loading, error, action } = state.authReducer;
  return { loading, error, action };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (payload) => dispatch({ type: LOGIN, payload }),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
