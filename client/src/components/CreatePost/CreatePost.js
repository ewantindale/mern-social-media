import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addPost } from '../../actions/postActions';
import { Button, Input } from 'reactstrap';
import './CreatePost.css'

class CreatePost extends Component {
  state = {
    body: ''
  }

  onChange = event => {
    if (event.target.value.length <= 100) {
      this.setState({
        body: event.target.value
      });
    }
  }

  onSubmit = event => {
    if (this.state.body.length <= 0) {
      return
    }
    event.preventDefault();

    const newPost = {
      body: this.state.body,
      author: this.props.user.name,
      authorId: this.props.user.id,
      authorProfilePic: this.props.user.profilePic
    }

    this.props.addPost(newPost);

    this.setState({
      body: ''
    });
  }

  render() {
    return (
        <div className="createPost">
          <Input
            type="textarea"
            name="body"
            className="createPostInput"
            onChange={this.onChange}
            placeholder="Speak your mind"
            value={this.state.body}
            variant="outlined"
          />
          <div className="createPostActions">
            <span className="createPostCharsRemaining">{100 - this.state.body.length} characters remaining</span>
            <Button className="createPostButton" color="primary" onClick={this.onSubmit} disabled={this.state.body.length < 1}>
              Post
            </Button>
          </div>
          
        </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { addPost })(CreatePost);