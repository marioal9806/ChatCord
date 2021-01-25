import React, { Fragment, useEffect, useReducer } from "react";
import axios from "axios";

import SelectRoomForm from "./components/SelectRoomForm";
import InputUsername from "./components/InputUsername";
import RoomTabList from "./components/RoomTabList";
import Spinner from "./components/Spinner";
import Avatar from "../globalComponents/Avatar";

function lobbyReducer(state, action) {
  switch (action.type) {
    case "FETCH_ROOMS":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_ROOMS_COMPLETED":
      return {
        ...state,
        isLoading: false,
        isError: false,
        rooms: action.payload,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        isLoading: false,
        isError: true,
        error: action.payload,
      };
    case "SET_USERNAME":
      return {
        ...state,
        username: action.payload,
      };
    case "SET_SELECTED_ROOM":
      return {
        ...state,
        selectedRoom: action.payload,
      };
    case "SET_AVATAR":
      return {
        ...state,
        avatar: action.payload
      };
    default:
      throw new Error();
  }
}

function Lobby() {
  const [state, dispatch] = useReducer(lobbyReducer, {
    rooms: [],
    selectedRoom: {},
    username: "",
    avatar: null,
    isLoading: true,
    isError: false,
    error: {},
  });

  // Get the list of available rooms
  useEffect(() => {
    let didCancel = false;
    const fetchRoomData = async () => {
      dispatch({ type: "FETCH_ROOMS" });
      try {
        const response = await axios.get("/api/rooms");
        if(!didCancel) {
          dispatch({
            type: "FETCH_ROOMS_COMPLETED",
            payload: response.data.rooms,
          });
          dispatch({ type: "SET_SELECTED_ROOM", payload: response.data.rooms[0] });
        }
      } catch (error) {
        if(!didCancel) {
          dispatch({ type: "FETCH_ERROR", payload: error });
        }
      }
    };
    fetchRoomData();
    return () => {
      didCancel = true;
    };
  }, []);

  useEffect(() => {
    axios.get('/user/data')
      .then(response => {
        const { isLoggedIn } = response.data

        if(isLoggedIn) {
          const { username, avatar } = response.data.user
          dispatch({ type: 'SET_USERNAME', payload: username })
          dispatch({ type: 'SET_AVATAR', payload: avatar })
        }
      })
  }, [])

  function handleSubmit() {
    let submitAvatar
    if(typeof state.avatar !== 'string') {
      const serializedSVG = new XMLSerializer().serializeToString(state.avatar)
      const base64Data = window.btoa(serializedSVG)
      const serializedAvatar = "data:image/svg+xml;base64," + base64Data
      submitAvatar = serializedAvatar
    } else {
      submitAvatar = state.avatar
    }

    axios
      .post("/join-room", {
        room: state.selectedRoom,
        username: state.username,
        avatar: submitAvatar
      })
      // If the request is successful, it means the room exists
      .then((response) => {
        // Redirect the user to the proper room
        const { id, name } = response.data.room;
        window.location.href = `/room/${id}`;
      })
      .catch((error) => {
        // If it fails, display the corresponding error
        console.log(error.response.data);
      });
  }

  function handleRandomUsername() {
    axios.get("/api/generate").then((response) => {
      dispatch({ type: "SET_USERNAME", payload: response.data.username });
    });
  }

  return (
    <Fragment>
      {state.isLoading && <Spinner />}
      {state.isError && <p>Error...</p>}
      <InputUsername
        isLoading={state.isLoading}
        isError={state.isError}
        username={state.username}
        dispatch={dispatch}
        handleRandomUsername={handleRandomUsername}
      />
      <Avatar 
        isLoading={state.isLoading}
        isError={state.isError}
        avatar={state.avatar}
        dispatch={dispatch}
      >
        You can also generate your own avatar!
      </Avatar>
      <RoomTabList 
        isLoading={state.isLoading}
        isError={state.isError}
        rooms={state.rooms} 
        dispatch={dispatch}
      />
      <SelectRoomForm
        isLoading={state.isLoading}
        isError={state.isError}
        selectedRoom={state.selectedRoom}
        rooms={state.rooms}
        handleSubmit={handleSubmit}
        dispatch={dispatch}
      />
    </Fragment>
  );
}

export default Lobby;
