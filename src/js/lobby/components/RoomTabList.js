import React, {useState, Fragment} from 'react'
import styled from 'styled-components'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import ButtonList from './ButtonList'

const Container = styled.section`
  margin: 1rem;
  padding: 1rem;

  background-color: #fff;
  border: 1px solid lightgray;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;

  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: row;
  }

`

const RoomInfo = styled.section`
  flex: 3;
  position: relative;
`

function RoomTabList(props) {
  if(props.isLoading || props.isError) {
    return null
  }

  const [index, setIndex] = useState(0)
  
  const handleClick = (index) => {
    setIndex(index)
    props.dispatch({ type: 'SET_SELECTED_ROOM', payload: props.rooms[index] })
  }

  return (
    <Fragment>
      <p>Below you have a brief description of each room.</p>
      <Container>
        <ButtonList rooms={props.rooms} handleClick={handleClick} currentIndex={index}/>
        <SwitchTransition mode={'out-in'}>
          <CSSTransition
            key={index}
            addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
            classNames='fade'
          >
            <RoomInfo>
              <h2 id="title">{props.rooms[index].name}</h2>
              <p id="description">{props.rooms[index].description}</p>
            </RoomInfo>
          </CSSTransition>
        </SwitchTransition>
      </Container>
    </Fragment>
  );
}

export default RoomTabList;