import React from 'react'
import styled from 'styled-components'

const StyledFlashMessage = styled.div`
  border-radius: 5px;
  color: #0F5132;
  background-color: #D1E7DD;
  border: 1px solid #BADBCC;
  margin: 1rem;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  & p {
    flex: 0 1 auto;
    margin: 0;
  }

  & button {
    border: none;
    background-color: transparent;
    color: inherit;
    padding: 0.5rem;
  }
`

function FlashMessage(props) {
  return (
    <StyledFlashMessage>
      <p>
        {props.message}
      </p>
      <button onClick={() => props.dismissFlashMessage(props.id)}>
        <i className="fas fa-times"></i>
      </button>
    </StyledFlashMessage>
  )
}

export default FlashMessage