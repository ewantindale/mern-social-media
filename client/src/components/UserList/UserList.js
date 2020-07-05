import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { followUser } from '../../actions/authActions'
import { Link } from 'react-router-dom';

class UserList extends Component {

  state = {
    users: [],
  }

  componentDidMount() {
    const getUsers = async () => {
      const { data } = await axios.get('/api/users')

      this.setState({users: data})
    }

  
    getUsers();
  }

  onFollowClick = (id) => {
    this.props.followUser(id)
  }

  render() {
    if (!this.props.user){
      return (
        <span>loading</span>
      )
    }
    return (
      <div className="userList">
        {this.state.users.map(({ name, _id }) => 
          <div key={_id}>
            <Link to={`/users/${_id}`}>{name}</Link>
            {this.props.user.id !== _id ? 
              <Button className="ml-2" onClick={this.onFollowClick.bind(this, _id)}>
                {!this.props.user.following.includes(_id) ? 'Follow' : 'Unfollow' }
              </Button>
            : 
              null  
            }
            
          </div>
        )}
      </div>
      
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { followUser })(UserList);