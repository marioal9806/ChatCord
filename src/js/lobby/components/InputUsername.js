import React, { Fragment } from "react";

function InputUsername(props) {
  return (
    <Fragment>
      <p>Insert your username below:</p>
      <input
        type="text"
        name="username"
        id="username"
        value={props.username}
        onChange={(e) => props.handleChange(e.target.value)}
        placeholder="Username..."
        required
      />
    </Fragment>
  );
}

export default InputUsername;
