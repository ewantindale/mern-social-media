import React, { Component } from 'react';
import CreatePost from '../CreatePost/CreatePost';
import PostFeed from '../PostFeed/PostFeed';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class Feed extends Component {
  render() {
    if (!this.props.isAuthenticated){
      return (
        <Redirect to="/login"/>
      )
    }
    return (
      <>
        <CreatePost/>
        <PostFeed/>
      </>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Feed);