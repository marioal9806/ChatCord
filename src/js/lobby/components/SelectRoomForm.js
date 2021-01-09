import React, { Fragment } from 'react'

function SelectRoomForm(props) {
  return (
    <Fragment>
      <p>Please select the conversation you would like to join:</p>
      <select name="room" value={props.selectedRoom.id} onChange={props.handleChange}>
        {props.rooms.map(room => {
          return <option key={room.id} value={room.id}>{room.name}</option>
        })}
      </select>
    </Fragment>
  )
}

export default SelectRoomForm
