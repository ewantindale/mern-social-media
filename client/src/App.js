import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import store from './store';
import { connect } from 'react-redux'
import AppNavbar from './components/AppNavbar/AppNavbar';
import Feed from './components/Feed/Feed';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import UserList from './components/UserList/UserList';
import SingleUser from './components/SingleUser/SingleUser';
import { loadUser } from './actions/authActions';
import { Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component{

  componentDidMount() {
    store.dispatch(loadUser())
  }

  render() {
    return (
      <Router>
        <div className="App">
        <AppNavbar/>
          <Container className="content">
            <Switch>
              <Route exact path="/" component={Feed}/>
              <Route path="/login" component={Login}/>
              <Route path="/register" component={Register}/>
              <Route exact path="/users" component={UserList}/>
              <Route path="/users/:id" component={SingleUser}/>
            </Switch>
          </Container>
        </div>
      </Router>
    );
  }
}


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, null)(App);