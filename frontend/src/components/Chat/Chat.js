import React, { useState, useEffect, useRef } from 'react'
import queryString from "query-string"
import io from "socket.io-client"
import "./Chat.css"
import Message from '../Message/Message.js'
import axios from "axios"
const ENDPOINT = "http://localhost:5000"
let socket;

const Chat = ({ location }) => {
    const [username, setUsername] = useState('')
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const messageCtn = useRef(null)
    const [users, setUsers] = useState([]);


    useEffect(() => {
        const { username, room } = queryString.parse(location.search);
        setUsername(username)
        setRoom(room)
        socket = io(ENDPOINT, { transports: ['websocket'] });
        socket.on('connect', async () => {
            if (socket.id) {
                socket.emit('JOIN', { id: socket.id, username, room })
                const res = await axios.get(`/getUsers?room=${room}`)
                // console.log(res.data)
                setUsers(res.data)
            }
            // console.log("here")
        })
    }, [location.search, room, username])

    useEffect(() => {
        socket.on('message', ({ message }) => {
            setMessages([...messages, { message, user: "other" }])
            messageCtn.current.scrollTo(0, parseInt(messageCtn.current.style.height))

        })

        socket.on('newUserJoin', ({ username, id }) => {
            // console.log(users)
            setUsers([...users, { username, id }])
        })

        socket.on('userExit', ({ newUsers }) => {
            console.log(newUsers)
            setUsers(newUsers)
        })

        return () => {
            socket.off();
        }
    }, [messages, users])

    useEffect(() => {
        messageCtn.current.scrollTo({
            top: messageCtn.current.scrollHeight,
            behavior: 'smooth'
        })
    }, [messages])


    const handleSend = (e) => {
        e.preventDefault()
        socket.emit('message', { message, room })
        setMessages([...messages, { message, user: "me" }])
        setMessage('')
    }
    return (
        <div className="ctn">
            <h3>{username}</h3>
            <div className="parent">
                <div className="roomname">
                    {room}
                </div>
                <div className="chat-ctn">
                    <div className="align-ctn">
                        <div className="msg-ctn" ref={messageCtn}>
                            <ul>
                                {messages.map((msg, i) => {
                                    return <li key={i}>
                                        <Message message={msg.message} user={msg.user} />
                                    </li>
                                })}
                            </ul>
                        </div>
                        <form onSubmit={handleSend} className="msg-form">
                            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                            <button ><i className="fas fa-angle-double-right"></i></button>
                        </form>
                    </div>
                </div>
                <div className="users-ctn">
                    <ul className="users-in-room">
                        {users.map((user, i) => {
                            return <li key={i} className="user-in-room" >
                                <img src={`https://ui-avatars.com/api/?name=${user.username}`} alt="" />
                                <span>{user.username}</span>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Chat
