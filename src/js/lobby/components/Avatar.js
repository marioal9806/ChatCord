import React, { Fragment, useEffect, useState, useCallback } from 'react'
import Avatars from '@dicebear/avatars'
import sprites from '@dicebear/avatars-avataaars-sprites'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`

const AvatarContainer = styled.div`
  background-color: #b721ff;
  border-radius: 15px;
  padding: 4px;
  padding-bottom: 2px;
`

const options = {
  width: 100,
  height: 100,
  background: '#fff',
  radius: 10,
}

function Avatar(props) {
  if(props.isLoading || props.isError) {
    return null
  }

  const [avatar, setAvatar] = useState(null)

  // Create avatar on render
  useEffect(() => {
    const avatars = new Avatars(sprites, options)
    const svg = avatars.create()
    setAvatar(svg)
  }, [])

  // Store a reference to the newly created svg element
  const svgNode = useCallback(node => {
    if (node !== null) {
      props.dispatch({ type: 'SET_AVATAR', payload: node.firstChild })
    }
  }, [avatar]);

  function handleClick(e) {
    const avatars = new Avatars(sprites, options)
    const svg = avatars.create()
    setAvatar(svg)
  }

  return (
    <Fragment>
      <p>You can also generate your own avatar!</p>
      <Container>
        { avatar && <AvatarContainer ref={svgNode} dangerouslySetInnerHTML={{__html: avatar}}></AvatarContainer> }
        <button type="button" className="btn primary" onClick={handleClick}>Generate Avatar</button>
      </Container>
    </Fragment>
  )
}

export default Avatar
