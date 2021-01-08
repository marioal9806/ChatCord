import React from 'react'

import Message from './Message'

function MessageBox(props) {
  return (
    <section className='message-box'>
      <ul>
        {props.messages.map((message, index) => {
          return <Message key={index} message={message}/>
        })}
      </ul>
    </section>
  )
}

export default MessageBox
