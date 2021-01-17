import React from 'react'
import styled from 'styled-components'
import Button from './Button'


const List = styled.ul`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-auto-rows: auto;
  grid-gap: 2rem;

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-rows: repeat(auto-fill, minmax(auto, 1fr));
    grid-auto-columns: auto;
    grid-gap: 1rem;
  }
`

function ButtonList(props) {
  return (
    <List>
      {props.rooms.map((room, index) => <Button room={room} currentIndex={props.currentIndex} key={room.id} index={index} handleClick={props.handleClick} />)}
    </List>
  )
}

export default ButtonList
