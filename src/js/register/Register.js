import React, { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import Alert from '../globalComponents/Alert'

const StyledLabel = styled.label`
  width: 40%;
  font-size: 1rem;

  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
  }
`

const StyledLink = styled.a`
  color: #b721ff;
  transition: color 200ms;

  &:hover {
    color: #21d4fd;
  }
`

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState([])

  function handleSubmit(e) {
    e.preventDefault();
    axios.post('/register', {
      username,
      email,
      password,
      confirmPassword
    })
    .then(response => {
      if(response.data.success) {
        window.location.href = '/login'
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

  return (
    <>
      <h2>Register a new account</h2>

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
          <StyledLabel htmlFor="username">Enter your username</StyledLabel>
          <input type="text" id="username" className="form-control" required onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className="form-group">
          <StyledLabel htmlFor="email">Enter your email</StyledLabel>
          <input type="email" id="email" className="form-control" required onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="form-group">
          <StyledLabel htmlFor="pwd">Enter your password</StyledLabel>
          <input type="password" id="pwd" className="form-control" required onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div className="form-group">
          <StyledLabel htmlFor="confirmPwd">Confirm your password</StyledLabel>
          <input type="password" id="confirmPwd" className="form-control" required onChange={(e) => setConfirmPassword(e.target.value)}/>
        </div>
        <p>Already have an account? <StyledLink href="/login">Log In</StyledLink></p>
        <button type="submit" className="btn primary">Register</button>
      </form>
    </>
  )
}

export default Register
