import React from 'react'
import styled from 'styled-components'
import Button from './Button'


const List = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-content: stretch;
  justify-content: space-between;

  padding: 2rem;
  list-style: none;
`

function ButtonList(props) {
  return (
    <List>
      {props.rooms.map((room, index) => <Button room={room} currentIndex={props.currentIndex} key={room.id} index={index} handleClick={props.handleClick} />)}
    </List>
  )
}

export default ButtonList
