import React, { useEffect, useRef } from 'react'

import Message from './Message'

function MessageBox(props) {
  const messageBoxNode = useRef(null)

  useEffect(() => {
    messageBoxNode.current.scrollTop = messageBoxNode.current.scrollHeight
  }, [props.messages])

  return (
    <section className='message-box' ref={messageBoxNode}>
      <ul>
        {props.messages.map((message, index) => {
          return <Message key={index} message={message}/>
        })}
      </ul>
    </section>
  )
}

export default MessageBox
