import React from 'react';
import { connect } from 'react-redux';
import { ListGroup, ListGroupItem} from 'reactstrap'
import { Link } from 'react-router-dom';
import { 
  FavoriteBorder, 
  Favorite, 
  DeleteOutline,
  CommentOutlined,
} from '@material-ui/icons';
import { getPosts, deletePost, likePost } from '../../actions/postActions';
import { followUser } from '../../actions/authActions';
import moment from 'moment';
import './PostFeed.css';
import AddComment from '../AddComment/AddComment';
import Avatar from '../Avatar/Avatar';


class PostFeed extends React.Component {

  state = {
    singlePostId: null
  }

  onViewCommentsClick = (id) => {
    if(this.state.singlePostId === id){
      this.setState({ singlePostId: null });
    } else {
      this.setState({ singlePostId: id });
    }
  }

  onBackClick = () => {
    this.setState({ singlePostId: null });
  }
  
  componentDidMount(){
    this.props.getPosts();
  }

  onDeleteClick = id => {
    this.props.deletePost(id);
  }

  onLikeClick = id => {
    this.props.likePost(id);
  }

  onFollowClick = userId => {
    this.props.followUser(userId)
  }
    
  render() {
    return (
      <ListGroup>
        {this.props.posts.length > 0 ? this.props.posts.map(({_id, body, author, authorId, authorProfilePic, date, likedBy, comments}) => (
          <ListGroupItem key={_id} className="post">
            <div className="postHeader">    
              <Link to={`/users/${authorId}`}><Avatar src={authorProfilePic} name={author} size='medium'/>
              <span className="text-body ml-3">{author}</span></Link>
              <span className="ml-auto text-muted">{moment(date).format('MMMM Do YYYY, h:mm:ss a')}</span>
            </div>
              <div className="postBody">
                {body}
              </div>
              <div className="postActions">
                <div className="commentButton" onClick={this.onViewCommentsClick.bind(this, _id)}>
                    <span>
                        <CommentOutlined/>
                        {comments.length}
                    </span>
                </div>
                <div className="likeButton" onClick={this.onLikeClick.bind(this, _id)}>
                  {likedBy.includes(this.props.user.id) ? 
                      <span className="fadeIn liked">
                        <Favorite/>
                        {likedBy.length}
                      </span>
                    : 
                      <span>
                        <FavoriteBorder/>
                        {likedBy.length}
                      </span>
                    }
                </div>
                {authorId === this.props.user.id ? 
                  <div className="deleteButton" onClick={this.onDeleteClick.bind(this, _id)}>
                    <DeleteOutline/>
                  </div> 
                : null }
              </div>
              {this.state.singlePostId === _id ? 
                <div className="postFeedComments">
                  <h5 className="pb-3 pt-3 text-muted">Comments</h5>
                  <AddComment id={_id}/>
                  {
                    comments.map(comment => 
                    <div key={comment._id} className="postFeedComment">
                      <Avatar src={comment.authorProfilePic} name={comment.author} size='small'/>
                      <span className="ml-3">{comment.author}: </span><span>{comment.body}</span>
                    </div>
                    )
                  }
                </div>
              : null }
          </ListGroupItem>
        )) : 
          <h4>No posts to display</h4>
        }
      </ListGroup>
    )
  }
}

const mapStateToProps = state => ({
  posts: state.posts.posts,
  user: state.auth.user
});

export default connect(mapStateToProps, { getPosts, deletePost, likePost, followUser })(PostFeed);