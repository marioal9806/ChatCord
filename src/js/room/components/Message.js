import React from 'react'

function Message(props) {
  return (
    <li className={`message ${ props.message.self ? 'self' : '' }`}>
      <div className={`message-container ${ props.message.self ? 'self' : '' }`}>
        { props.message.avatar ?
          <img src={props.message.avatar} /> :
          <i className="fas fa-user-circle fa-2x"></i> 
        }
        <div className="message-text">
          <span className="username">{`${props.message.username}`}</span>
          <br/>
          <span>{props.message.message}</span>
        </div>
      </div>
    </li>
  )
}

export default Message
