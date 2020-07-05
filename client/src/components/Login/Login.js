import React, { Component } from 'react';
import { Button, Input, Label, Form, FormGroup, Alert } from 'reactstrap'
import { connect } from 'react-redux';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import {
  Link,
  Redirect,
} from "react-router-dom";
import './Login.css';


class Login extends Component {

  state = {
    email: '',
    password: '',
    msg: null
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if(error !== prevProps.error) {
      if(error.id === 'LOGIN_FAIL'){
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit = async (e) => {
    const { email, password } = this.state;

    const user = {
      email,
      password
    };

    this.props.login(user)
  }

  render() {
    if (this.props.isAuthenticated === true){
      return (
        <Redirect to="/"/>
      )
    }
    return (
        <div className="login">
          <div className="loginInner">
            <span className="text-muted">Welcome to Social</span>
            <h2>Log into your account</h2>
            <Form>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  onChange={this.onChange}
                  className="loginEmailInput"
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  onChange={this.onChange}
                  className="loginPasswordInput"
                />
              </FormGroup>
              
              { this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null }
              <FormGroup>
                <Button color="primary" onClick={this.onSubmit} className="loginSubmitButton">Login</Button>
              </FormGroup>
              <FormGroup>
                <Link to="/register" className="loginRegisterButton">Click here to Register instead</Link>
              </FormGroup>
              </Form>
            
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  error: state.error
});

export default connect(mapStateToProps, { login, clearErrors })(Login);
