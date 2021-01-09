import React, {useState, Fragment} from 'react'
import styled from 'styled-components'
import {useTransition, animated} from 'react-spring'

import ButtonList from './ButtonList'

const Container = styled.section`
  margin: 1rem 1rem;

  border: 1px solid lightgray;
  border-radius: 10px;

  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;

`

const RoomInfo = styled.article`
  flex: 3;
  position: relative;
`

const OuterContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
`

const AnimatedOuterContainer = animated(OuterContainer)

const InnerContainer = styled.div`
  position: relative;
  text-align: center;
`

function RoomTabList(props) {
  if(props.rooms.length === 0) {
    return null
  }

  const [index, setIndex] = useState(0)
  
  const handleClick = (index) => {
    setIndex(index)
  }

  const transitions = useTransition(props.rooms[index], key => key.id, {
    from: {opacity: 0},
    enter: {opacity: 1},
    leave: {opacity: 0},
  })


  return (
    <Fragment>
      <p>Below you have a brief description of each room.</p>
      <Container>
        <ButtonList rooms={props.rooms} handleClick={handleClick} currentIndex={index}/>
        <RoomInfo>
          { transitions.map(({ item, props, key }) => {
              return <AnimatedOuterContainer style={props} key={key}>
                <InnerContainer>
                  <h2>{item.name}</h2>
                  <p>{item.description}</p>
                </InnerContainer>
              </AnimatedOuterContainer>
            })
          }
        </RoomInfo>
      </Container>
    </Fragment>
  );
}

export default RoomTabList;