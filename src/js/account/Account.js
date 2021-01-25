import React, { useReducer, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import Avatar from '../globalComponents/Avatar'
import Alert from '../globalComponents/Alert'
import FlashMessage from '../globalComponents/FlashMessage'

const StyledFieldset = styled.fieldset`
  border-radius: 5px;
  border: 1px solid #333;
  margin: 1rem 0;
  padding: 0.5rem;
  position: relative;

  & legend {
    padding: 0.5rem;
    border-radius: 5px;
    color: #fff;
    background-color: #333;
  }
`

const StyledLabel = styled.label`
  width: 30%;
  font-size: 1rem;

  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
  }
`

function settingsReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true
      }
    case 'FETCH_COMPLETE':
      return {
        ...state,
        isLoading: false,
        username: action.payload.username,
        avatar: action.payload.avatar
      }
    case 'FETCH_ERROR':
      return {
        ...state,
        isError: true,
        errors: action.payload.map(error => {
          return { ...error, id: uuidv4() }
        })
      }
    case 'SET_AVATAR':
      return {
        ...state,
        avatar: action.payload
      }
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.payload 
      }
    case 'SET_CURRENT_PASSWORD':
      return {
        ...state,
        currentPassword: action.payload
      }
    case 'SET_NEW_PASSWORD':
      return {
        ...state,
        newPassword: action.payload
      }
    case 'SET_CONFIRM_PASSWORD':
      return {
        ...state,
        confirmPassword: action.payload
      }
    case 'UPDATE_ERROR':
      return {
        ...state,
        errors: [...state.errors, ...action.payload.map(error => {
          return { ...error, id: uuidv4() }
        })]
      }
    case 'UPDATE_FLASH_MESSAGE':
      return {
        ...state,
        flashMessages: [...state.flashMessages, { msg: action.payload, id: uuidv4() }]
      }
    case 'DISMISS_ALERT':
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload)
      }
    case 'DISMISS_FLASH_MESSAGE':
      return {
        ...state,
        flashMessages: state.flashMessages.filter(message => message.id !== action.payload)
      }
    default:
      throw new Error()
  }
}

function Account() {

  const [state, dispatch] = useReducer(settingsReducer, {
    isLoading: true,
    isError: false,
    avatar: null,
    username: '',
    errors: [],
    flashMessages: [],
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    dispatch({ type: 'FETCH_START' })
    axios.get('/user/data')
      .then(response => {
        dispatch({ type: 'FETCH_COMPLETE', payload: response.data.user  })
      })
      .catch(error => {
        dispatch({ type: 'FETCH_ERROR', payload: error.response.data.errors })
      })
  }, [])

  function handleSubmit(e) {
    e.preventDefault()

    if(state.currentPassword || state.newPassword || state.confirmPassword) {
      axios.post('/user/update/password', {
        currentPassword: state.currentPassword,
        newPassword: state.newPassword,
        confirmPassword: state.confirmPassword
      })
      .then(response => {
        console.log(response.data)
        dispatch({ type: 'UPDATE_FLASH_MESSAGE', payload: response.data.message})
      })
      .catch(error => {
        console.log(error.response.data)
        dispatch({ type: 'UPDATE_ERROR', payload: error.response.data.errors })
      })
    }

    if(state.username) {
      axios.post('/user/update/username', {
        username: state.username
      })
      .then(response => {
        dispatch({ type: 'UPDATE_FLASH_MESSAGE', payload: response.data.message})
      })
      .catch(error => {
        dispatch({ type: 'UPDATE_ERROR', payload: error.response.data.errors })
      })
    }

    let submitAvatar
    if(typeof state.avatar !== 'string') {
      const serializedSVG = new XMLSerializer().serializeToString(state.avatar)
      const base64Data = window.btoa(serializedSVG)
      const serializedAvatar = "data:image/svg+xml;base64," + base64Data
      submitAvatar = serializedAvatar
    }
    else {
      submitAvatar = state.avatar
    }

    axios.post('/user/update/avatar', {
      avatar: submitAvatar
    })
    .then(response => {
      dispatch({ type: 'UPDATE_FLASH_MESSAGE', payload: response.data.message})
    })
    .catch(error => {
      console.log(error.response.data)
    })
  }

  function dismissAlert(id) {
    dispatch({ type: 'DISMISS_ALERT', payload: id })
  }

  function dismissFlashMessage(id) {
    dispatch({ type: 'DISMISS_FLASH_MESSAGE', payload: id })
  }

  return (
    <>
      <h2>My Account</h2>
      <p>You can change your user settings with the options below.</p>

      <TransitionGroup>
        { state.flashMessages.length !== 0 && state.flashMessages.map(message => (
          <CSSTransition
            key={message.id}
            timeout={200}
            classNames="alert"
          >
            <FlashMessage message={message.msg} id={message.id} dismissFlashMessage={dismissFlashMessage}/>
          </CSSTransition>
        ))}
      </TransitionGroup>

      <TransitionGroup>
        { state.errors.length !== 0 && state.errors.map(error => (
          <CSSTransition
            key={error.id}
            timeout={200}
            classNames="alert"
          >
            <Alert message={error.msg} id={error.id} dismissAlert={dismissAlert}/>
          </CSSTransition>
        ))}
      </TransitionGroup>

      <form onSubmit={handleSubmit}>
        <StyledFieldset>
          <legend>Insert your current password and the new password</legend>
          <div className="form-group">
            <StyledLabel htmlFor="userame">New username</StyledLabel>
            <input type="text" id="username" className="form-control" value={state.username} onChange={(e) => dispatch({type:'SET_USERNAME', payload: e.target.value})}/>
            <button className="btn primary">Generate Random</button>
          </div>
        </StyledFieldset>
        <StyledFieldset>
          <legend>Change your Avatar</legend>
          <Avatar 
            isLoading={state.isLoading}
            isError={state.isError}
            avatar={state.avatar}
            dispatch={dispatch}
          >
            You can generate a new random Avatar
          </Avatar>
        </StyledFieldset>
        <StyledFieldset>
          <legend>Insert your current password and the new password</legend>
          <div className="form-group">
            <StyledLabel htmlFor="currentPassword">Current Password</StyledLabel>
            <input type="password" name="currentPassword" id="currentPassword" className="form-control" onChange={(e) => dispatch({type:'SET_CURRENT_PASSWORD', payload: e.target.value})}/>
          </div>
          <div className="form-group">
            <StyledLabel htmlFor="newPassword">New Password</StyledLabel>
            <input type="password" name="newPassword" id="newPassword" className="form-control" onChange={(e) => dispatch({type:'SET_NEW_PASSWORD', payload: e.target.value})}/>
          </div>
          <div className="form-group">
            <StyledLabel htmlFor="confirmPassword">Confirm Password</StyledLabel>
            <input type="password" name="confirmPassword" id="confirmPassword" className="form-control" onChange={(e) => dispatch({type:'SET_CONFIRM_PASSWORD', payload: e.target.value})}/>
          </div>
        </StyledFieldset>
        <button type="submit" className="btn primary">Save Changes</button>
      </form>

    </>
  )
}

export default Account
