import React, { Fragment } from "react";

function InputUsername(props) {
  return (
    <Fragment>
      <p>Insert your username below. Or you can generate it randomly!</p>
      <input
        type="text"
        name="username"
        id="username"
        value={props.username}
        onChange={(e) => props.handleChange(e.target.value)}
        placeholder="Username..."
        required
      />
      <button type="button" className="btn secondary" onClick={props.handleRandom}>Generate Random</button>
    </Fragment>
  );
}

export default InputUsername;
