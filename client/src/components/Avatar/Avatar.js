import React, {Component} from 'react';
import './Avatar.css';

export default class Avatar extends Component{
  state = {
    error: false 
  }

  noProfilePic = () => {
    this.setState({error: true})
  }

  render() {
    if(this.state.error || this.props.src === ''){
      return (
        <span className={`d-inline-flex justify-content-center align-items-center bg-dark text-light h1 text-uppercase font-weight-bold ${this.props.size}`}>
          {this.props.name[0]}
        </span>
      );
    }


    return (
      <img src={this.props.src} className={this.props.size} onError={this.noProfilePic}/>
    );
  }
  
}
