import React, { Fragment } from "react";

function InputUsername(props) {
  if (props.isLoading || props.isError) {
    return null;
  }

  return (
    <Fragment>
      <p>Insert your username below. Or you can generate it randomly!</p>
      <input
        type="text"
        name="username"
        id="username"
        value={props.username}
        onChange={(e) =>
          props.dispatch({ type: "SET_USERNAME", payload: e.target.value })
        }
        placeholder="Username..."
        required
      />
      <button
        type="button"
        className="btn primary"
        onClick={props.handleRandomUsername}
      >
        Generate Random
      </button>
    </Fragment>
  );
}

export default InputUsername;
