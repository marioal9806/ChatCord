import React from 'react'
import styled from 'styled-components'

const StyledAlert = styled.div`
  border-radius: 5px;
  color: #842029;
  background-color: #F8D7DA;
  border: 1px solid #F5C2C7;
  margin: 1rem;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  & p {
    flex: 0 1 auto;
    margin: 0;
  }

  & span {
    font-weight: bold;
  }

  & button {
    border: none;
    background-color: transparent;
    color: inherit;
    padding: 0.5rem;
  }
`

function Alert(props) {
  return (
    <StyledAlert>
      <p>
        <span>Error: </span>
        {props.message}
      </p>
      <button onClick={() => props.dismissAlert(props.id)}>
        <i className="fas fa-times"></i>
      </button>
    </StyledAlert>
  )
}

export default Alert
