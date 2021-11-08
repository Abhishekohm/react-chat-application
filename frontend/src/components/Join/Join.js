import React, { useState } from 'react'
import { Link } from "react-router-dom"
import './Join.css'
const Join = () => {
    const [username, setUsername] = useState('')
    const [room, setRoom] = useState('')
    return (
        <div className="join-form-ctn">
            <form className="join-form">
                <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
                <input type="text" onChange={(e) => setRoom(e.target.value)} placeholder="Enter room name" />
                <button className="submit-btn">
                    <Link to={`/chat?username=${username}&room=${room}`} className="link">
                        Join
                    </Link>
                </button>
            </form>
        </div>
    )
}

export default Join
