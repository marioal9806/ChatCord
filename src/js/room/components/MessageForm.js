import React from "react";

function MessageForm(props) {
  function handleSubmit(e) {
    e.preventDefault();
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
      />
      <button type="submit" className="btn" disabled={!props.message}>
        <i className="fas fa-location-arrow"></i>
      </button>
    </form>
  );
}

export default MessageForm;
