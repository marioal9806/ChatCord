import React, { Fragment, useState, useEffect, useMemo } from "react";

import UserList from "./components/UserList";
import MessageBox from "./components/MessageBox";
import MessageForm from "./components/MessageForm";

import axios from "axios";
import io from "socket.io-client";

function Chat() {
  const [title, setTitle] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentRoom, setCurrentRoom] = useState({});
  const [avatar, setAvatar] = useState('')

  const socket = useMemo(() => {
    return io()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      // Get the username stored in the server session
      let username
      try {
        username = (await axios.get('/api/username')).data.username
        // Save username in local state
        setUsername(username)
      }
      catch(error) {
        console.log(error.response.data)
        username = 'Anonymous'
        setUsername('Anonymous')
      }
  
      // Get the list of available rooms
      const rooms = (await axios.get("/api/rooms")).data.rooms
      const pathname = window.location.pathname.split("/")[2];
  
      // Find the current room among the available rooms given the url parameters
      const room = rooms.filter((room) => {
        return room.id === pathname;
      })[0];
  
      setTitle(room.name);
      // Save room details in local state
      setCurrentRoom(room);
      // Emit event for the socket to join the current room
      socket.emit("join room", room, username);
    }

    fetchData();
  }, [])

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await axios.get('/api/avatar')
        setAvatar(response.data.avatar)
      }
      catch(error) {
        console.log(error)
      }
    }
    fetchAvatar()
  }, [])

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  useEffect(() => {
    socket.on("userlist change", ({userlist}) => {
      setOnlineUsers(userlist)
    })
  }, [])

  function handleNewMessage() {
    socket.emit("message", { message: newMessage, username: username, avatar: avatar}, currentRoom);
    setMessages(prevMessages => [...prevMessages, { message: newMessage, username: username, self: true, avatar: avatar }]);
    setNewMessage("");
  }

  return (
    <Fragment>
      <h2>{title}</h2>

      <UserList onlineUsers={onlineUsers} />

      <MessageBox messages={messages} />

      <MessageForm
        message={newMessage}
        handleNewMessage={handleNewMessage}
        setNewMessage={setNewMessage}
      />
    </Fragment>
  );
}

export default Chat;
