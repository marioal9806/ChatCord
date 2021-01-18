import React, { Fragment } from "react";

function SelectRoomForm(props) {
  if (props.isLoading || props.isError) {
    return null;
  }

  return (
    <Fragment>
      <p>Please select the conversation you would like to join:</p>
      <div className="form-group">
        <select
          name="room"
          value={props.selectedRoom.id}
          className="form-control"
          onChange={(e) =>
            props.dispatch({
              type: "SET_SELECTED_ROOM",
              payload: props.rooms[e.target.selectedIndex],
            })
          }
        >
          {props.rooms.map((room) => {
            return (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            );
          })}
        </select>
        <button type="button" className="btn primary" onClick={props.handleSubmit}>
          Join!
        </button>
      </div>
    </Fragment>
  );
}

export default SelectRoomForm;
