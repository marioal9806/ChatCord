import React from 'react'

function Message(props) {
  return (
    <li className={`message ${ props.message.self ? 'self' : '' }`}>
      <div className={`message-container ${ props.message.self ? 'self' : '' }`}>
        <i className="fas fa-user-circle"></i>
        <span>{`${props.message.username}: `}{props.message.message}</span>
      </div>
    </li>
  )
}

export default Message
