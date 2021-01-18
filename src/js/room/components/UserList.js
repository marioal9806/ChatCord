import React from 'react'

function UserList(props) {
  return (
    <aside className='user-list'>
      <h3>Online Users</h3>
      <ul>
        { props.onlineUsers.length === 0 && <li>Whoops! No users online</li> }
        { props.onlineUsers.length !== 0 && props.onlineUsers.map((user, index) => {
          return <li className="user" key={index}><span>&#128073;</span>{user.username}</li>
        })}
      </ul>
    </aside>
  )
}

export default UserList
