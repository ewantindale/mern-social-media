import React, { Component } from 'react';
import axios from 'axios';
import Avatar from '../Avatar/Avatar';
import { ListGroup, ListGroupItem } from 'reactstrap';
import moment from 'moment';

export default class SingleUser extends Component {

  state = {
    name: '',
    bio: '',
    profilePic: '',
    posts: [],
    postsLoading: true
  }

  componentDidMount(){
    const getUserInfo = () => {
      axios.get(`/api/users/${this.props.match.params.id}`).then(res =>
        this.setState({ name: res.data.name, bio: res.data.bio, profilePic: res.data.profilePic })
      ).catch(err => {
        console.log(err);
      });
    }

    const getUserPosts = () => {
      axios.get(`/api/posts/user/${this.props.match.params.id}`).then(res => 
        this.setState({ posts: res.data, postsLoading: false })
      ).catch(err => {
        console.log(err);
      });
    }

    getUserInfo();
    getUserPosts();
  }

  render() {
    return (
      <div>
        <div className="d-flex flex-row">
          <Avatar src={this.state.profilePic} name={this.state.name} size='large'/>
          <div className="d-flex flex-column justify-content-center ml-5">
            <h1> {this.state.name} </h1>
            <h2 className="text-secondary"> {this.state.bio} </h2>
          </div>
        </div>
        <div className="mt-5">
          {this.state.postsLoading ? <div>Loading user's posts...</div> : 
          <ListGroup>
            {this.state.posts.map(post => 
            <ListGroupItem key={post._id}>
              <div className="d-flex">
                <div>{post.body}</div>
                <span className="ml-auto text-muted">{moment(post.date).format('MMMM Do YYYY, h:mm:ss a')}</span>
              </div>
            </ListGroupItem>
            )}
          </ListGroup>
          
          
          }
        </div>
      </div>
      
    );
  }
}
