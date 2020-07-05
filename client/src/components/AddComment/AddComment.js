import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addComment } from '../../actions/postActions';
import { Button, Input } from 'reactstrap';
import './AddComment.css'


class AddComment extends Component {
  state = {
    body: ''
  }

  onChange = event => {
    if (event.target.value.length <= 50) {
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

    const newComment = {
      body: this.state.body,
      author: this.props.user.name,
      authorId: this.props.user.id,
      authorProfilePic: this.props.user.profilePic
    }

    this.props.addComment(this.props.id, newComment);

    this.setState({
      body: ''
    });
  }

  render() {
    return (
      <div className="d-flex flex-row bd-highlight mb-3 align-items-center">
        <Input
          name="body"
          id="commentContent"
          onChange={this.onChange}
          placeholder="Write your comment here"
          value={this.state.body}
          size="small"
          className="p-2 bd-highlight"
          autoFocus
        />
        <Button className="p-2 bd-highlight addCommentButton" color="primary" size="sm" disabled={this.state.body.length < 1} onClick={this.onSubmit}>
          Add Comment
        </Button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { addComment })(AddComment);