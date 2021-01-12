import React, { Fragment } from "react";

function SelectRoomForm(props) {
  if (props.isLoading || props.isError) {
    return null;
  }

  return (
    <Fragment>
      <p>Please select the conversation you would like to join:</p>
      <select
        name="room"
        value={props.selectedRoom.id}
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
    </Fragment>
  );
}

export default SelectRoomForm;
