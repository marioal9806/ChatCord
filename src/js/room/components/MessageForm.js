import React, { useRef } from "react";

function MessageForm(props) {
  const inputNode = useRef(null)

  function handleSubmit(e) {
    e.preventDefault();
    inputNode.current.focus();
    props.handleNewMessage();
  }

  function handleChange(e) {
    props.setNewMessage(e.target.value);
  }

  return (
    <form className="message-form" onSubmit={handleSubmit} autoComplete='off'>
      <input
        name="message-input"
        value={props.message}
        onChange={handleChange}
        placeholder="Send a new message..."
        autoFocus
        ref={inputNode}
      />
      <button type="submit" className="btn" disabled={!props.message}>
        <i className="fas fa-location-arrow"></i>
      </button>
    </form>
  );
}

export default MessageForm;
