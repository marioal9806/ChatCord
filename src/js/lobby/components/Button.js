import React from 'react'
import styled from 'styled-components'

const ListItem = styled.li`
  width: 100%;
  margin: 10px;
`

const StyledButton = styled.button`
  font-family: inherit;
  font-size: 1rem;
  color: white;
  background-color: #0d6efd;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  transition: transform 200ms, background-color 200ms, border 200ms;

  &:hover {
    transform: translate(-2px, -2px);
    background-color: #75adff;
  }

  &.active {
    transform: translate(-2px, -2px);
    background-color: #75adff;
    border: 3px solid black;
  }
`


function Button(props) {
  return (
    <ListItem>
      <StyledButton type='button' className={props.currentIndex === props.index ? 'active' : ''} onClick={(e) => props.handleClick(props.index, e)}>{props.room.name}</StyledButton>
    </ListItem>
  )
}

export default Button
