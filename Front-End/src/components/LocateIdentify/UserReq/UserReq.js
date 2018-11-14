import React, { Component } from 'react';
import './UserReq.css'
import UserBox from '../UserBox';


class UserReq extends Component {
  constructor(props) {
    super(props);
    this.onUserSel = this.onUserSel.bind(this);
    this.onUserRemove = this.onUserRemove.bind(this);
    this.state = {
      userList: [],
      userSelect: '',
      userNum: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    const newUserList = nextProps.userList;
    this.setState({ userList: newUserList })
  }
  onUserSel(index) {
    this.setState({ userSelect: index }, () => {
      this.props.userSelect(this.state.userSelect)
    })
  }
  onUserRemove(index){
    this.setState({ userSelect: '' }, () => {
      this.props.userRemove(index)
      this.props.userSelect(this.state.userSelect)
    })
  }
  render() {
    const userList = this.state.userList
    return (
      <div>
        <ul className="sidebar navbar-nav">
          <div className="scroll-box">
            <div className="scroll-box-content">
              {
                userList.map((data, index) => {
                  console.log(data)
                  return (
                    <div className={this.state.userSelect === index ? 'list-user' : null} key={index} onClick={() => this.onUserSel(index)}>
                      <UserBox num={index} address={data.addrCur} />
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="btn-locate">
            <button type="button" className="btn btn-success btn-lg" onClick={() => this.onUserRemove(this.state.userSelect)}><span>Gửi đi</span></button>
          </div>
        </ul>
      </div>
    )
  }
}

export default UserReq;
