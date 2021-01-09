import React, { Fragment, useState, useEffect }  from 'react'
import axios from 'axios'

import SelectRoomForm from './components/SelectRoomForm'
import InputUsername from './components/InputUsername'
import RoomTabList from './components/RoomTabList'

function Lobby() {
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState({ id: '', name: '' })
  const [username, setUsername] = useState('')

  // Get the list of available rooms
  useEffect(() => {
    axios.get('/api/rooms')
      .then(response => {
        setRooms(response.data.rooms)
        setSelectedRoom(response.data.rooms[0])
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  function handleSubmit(e) {
    axios.post('/join-room', {
      room: selectedRoom,
      username: username
    })
      // If the request is successful, it means the room exists
      .then(response => {
        // Redirect the user to the proper room
        console.log(response.data.room)
        const { id, name } = response.data.room
        window.location.href = `/room/${id}`
      })
      .catch(error => {
        // If it fails, display the corresponding error
        console.log(error.response.data)
      })

  }

  function handleChange(e) {
    const newRoom = rooms[e.target.selectedIndex]
    setSelectedRoom(newRoom)
  }

  return (
    <Fragment>
      <InputUsername username={username} handleChange={setUsername} />
      <RoomTabList rooms={rooms}/>
      <SelectRoomForm selectedRoom={selectedRoom} handleChange={handleChange} rooms={rooms}/>
      <button type='button' className='btn secondary' onClick={handleSubmit}>
        Join!
      </button>
    </Fragment>
  )
}

export default Lobby