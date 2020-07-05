import React, { Component } from 'react';
import { Button, Input, Label, Form, FormGroup, Alert } from 'reactstrap'
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import './Register.css';


class Register extends Component {

  state = {
    name: '',
    email: '',
    password: '',
    msg: null
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if(error !== prevProps.error) {
      if(error.id === 'REGISTER_FAIL'){
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

  onSubmit = (e) => {
    const { name, email, password } = this.state;

    const user = {
      name,
      email,
      password
    };

    this.props.register(user)
  }

  render() {
    if (this.props.isAuthenticated === true){
      return (
        <Redirect to="/"/>
      )
    }
    return (
        <div className="register">
          <div className="registerInner">
            <span className="text-muted">Welcome to Social</span>
            <h2>Register a new account</h2>
            <Form>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  name="name"
                  id="name"
                  type="text"
                  onChange={this.onChange}
                  className="registerNameInput"
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  onChange={this.onChange}
                  className="registerEmailInput"
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  onChange={this.onChange}
                  className="registerPasswordInput"
                />
              </FormGroup>
              
              { this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null }
              <FormGroup>
                <Button color="primary" onClick={this.onSubmit} className="registerSubmitButton">Register</Button>
              </FormGroup>
              <FormGroup>
                <Link to="/" className="registerLoginButton">Click here to Login instead</Link>
              </FormGroup>
              </Form>
            
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(mapStateToProps, { register, clearErrors })(Register);
