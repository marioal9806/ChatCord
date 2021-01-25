import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import Alert from '../globalComponents/Alert'
import FlashMessage from '../globalComponents/FlashMessage'

const StyledLabel = styled.label`
  width: 40%;
`

const StyledLink = styled.a`
  color: #b721ff;
  transition: color 200ms;

  &:hover {
    color: #21d4fd;
  }
`

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState([])
  const [flashMessages, setFlashMessages] = useState([])

  useEffect(() => {
    axios.get('/api/flash')
      .then(response => {
        setFlashMessages(response.data.flashMessages.map(message => {
          return { msg: message, id: uuidv4() }
        }))
      })
  }, [])

  function handleSubmit(e) {
    e.preventDefault();
    axios.post('/login', {
      email,
      password
    })
    .then(response => {
      console.log(response.data)
      if(response.data.success) {
        window.location.href = '/'
      }
    })
    .catch(error => {
      setErrors(error.response.data.errors.map(error => {
        return { ...error, id: uuidv4() }
      }))
    })
  }

  function dismissAlert(id) {
    setErrors(prevErrors => prevErrors.filter(error => error.id !== id))
  }

  function dismissFlashMessage(id) {
    setFlashMessages(prevMessages => prevMessages.filter(message => message.id !== id))
  }

  return (
    <>
      <h2>Log into your account</h2>

      <TransitionGroup>
        { flashMessages.length !== 0 && flashMessages.map(message => (
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
        { errors.length !== 0 && errors.map(error => (
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
        <div className="form-group">
          <StyledLabel htmlFor="email">Enter your email</StyledLabel>
          <input type="email" id="email" className="form-control" value={email} required onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="form-group">
          <StyledLabel htmlFor="pwd">Enter your password</StyledLabel>
          <input type="password" id="pwd" className="form-control" value={password} required onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <p>Don't have an account? <StyledLink href="/register">Register</StyledLink></p>
        <button type="submit" className="btn primary">Log In</button>
      </form>
    </>
  )
}

export default Login
