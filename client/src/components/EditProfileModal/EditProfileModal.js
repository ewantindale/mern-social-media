import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { updateUser, updateProfilePicture } from '../../actions/authActions'
import Avatar from '../Avatar/Avatar';

class EditProfileModal extends Component {

  state = {
    selectedFile: null,
    name: '',
    bio: '',
    modal: false
  }

  componentDidMount(){
    this.setState({name: this.props.user.name, bio: this.props.user.bio})
  }

  toggle = () => {
    this.setState({modal: !this.state.modal})
  }

  validateFileSize = event => {
    const files = event.target.files
    const maxSize = 50000
    
    if (files[0].size >= maxSize) {
      alert("File is too large, profile pictures must be < 50kB");
      event.target.value = null;
      return false;
    }

    return true;
  }

  validateFileType = event => {
    const files = event.target.files;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];

    if (!allowedTypes.includes(files[0].type)) {
      alert("Invalid file type, profile pictures must be .png, .jpeg or .gif");
      event.target.value = null;
      return false;
    }

    return true;
  }
  
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onFileChange = event => {
    if(this.validateFileType(event) && this.validateFileSize(event)){
      this.setState({
        selectedFile: event.target.files[0],
        loaded: 0
      })
    }
  }

  onSubmit = (e) => {
    e.preventDefault();

    if (this.state.selectedFile){
      const data = new FormData();
      data.append('image', this.state.selectedFile)
      this.props.updateProfilePicture(data);
    }
    
    this.props.updateUser({name: this.state.name, bio: this.state.bio})

    this.toggle();
    window.location.reload(false);
  }

  render() {
    return (
      <div>
        <a href="#" onClick={this.toggle} className="text-light ml-2 p-2 rounded text-decoration-none">My Profile</a>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Edit Profile</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Avatar src={this.props.user.profilePic} name={this.props.user.name} size='large'/>
                <Input type="file" name="file" id="file" className="mt-3" onChange={this.onFileChange}/>
                <Label for="name">Name</Label>
                <Input name="name" id="name" type="text" className="mb-3" value={this.state.name} onChange={this.onChange}/>
                <Label for="bio">Bio</Label>
                <Input name="bio" id="bio" type="text" className="mb-3" value={this.state.bio} onChange={this.onChange}/>
                <Button color="primary" block>Confirm</Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  isLoading: state.auth.isLoading,
  error: state.error
});

export default connect(mapStateToProps, { updateUser, updateProfilePicture })(EditProfileModal)
