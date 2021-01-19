import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'

const Header = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  color: #fff;
  background-color: #333;

  & h3 {
    margin-left: auto;
  }

  & i {
    margin-left: auto;
    padding: 0.5rem;
    cursor: pointer;
    transition: transform 300ms;
  }

  & i:hover {
    transform: scale(1.1);
  }

  & i.active {
    transform: rotateZ(180deg);
  }
`

const Dropdown = styled.div`
  overflow: hidden;
  transition: max-height 300ms;
`

function UserList(props) {
  const [isHidden, setIsHidden] = useState(false)
  const listNode = useRef(null)

  useEffect(() => {
    listNode.current.style.maxHeight = isHidden
      ? '0px'
      : listNode.current.scrollHeight + 'px'
  }, [isHidden])

  return (
    <aside className='user-list'>
      <Header>
        <h3>Online Users</h3>
        <i 
          className={`fas fa-chevron-circle-down fa-2x ${isHidden ? '':'active'}`} 
          onClick={() => setIsHidden(prevState => !prevState)}
        ></i>
      </Header>
      <Dropdown ref={listNode}>
        <ul>
          { props.onlineUsers.length === 0 && <li>Whoops! No users online</li> }
          { props.onlineUsers.length !== 0 && props.onlineUsers.map((user, index) => {
            return <li className="user" key={index}><span>&#128073;</span>{user.username}</li>
          })}
        </ul>
      </Dropdown>
    </aside>
  )
}

export default UserList
