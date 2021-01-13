import React from 'react'

function Message(props) {
  return (
    <li className={`message ${ props.message.self ? 'self' : '' }`}>
      <div className={`message-container ${ props.message.self ? 'self' : '' }`}>
        { props.message.avatar ?
          <img src={props.message.avatar} /> :
          <i className="fas fa-user-circle fa-2x"></i> 
        }
        <span>{`${props.message.username}: `}{props.message.message}</span>
      </div>
    </li>
  )
}

export default Message
