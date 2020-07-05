import React, { Component } from 'react';
import {Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, Collapse, Container} from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import EditProfileModal from '../EditProfileModal/EditProfileModal'

class AppNavbar extends Component {

  state = {
    isOpen: false
  }

  toggleNavbar = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }
  
  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      
        <Navbar color="dark" dark expand="sm" className="mb-5">
          <Container>
            <Link to="/" className="mr-auto text-decoration-none text-light"><h4 className="mb-0">Social</h4></Link>
            {/* <NavbarBrand href="/" className="mr-auto"></NavbarBrand> */}
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                { isAuthenticated ? 
                  <>
                    <NavItem>
                      <Link to="/users" className="text-light ml-2 p-2 rounded text-decoration-none">Users</Link>
                    </NavItem>
                    <NavItem>
                      <EditProfileModal/>
                    </NavItem>
                    <NavItem>
                      <Link to="/" className="text-light ml-2 p-2 rounded text-decoration-none" onClick={this.props.logout}>Logout</Link>
                    </NavItem>
                  </>
                :
                null
              }
                
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(AppNavbar);
