import React from 'react'
import './Message.css'

const Message = ({ message, user }) => {
    return (
        <div className={"message " + (user === "other" ? "message-align-left" : "message-align-right")}>
            <div className="msg-ctn1">
                <p>{message}</p>
            </div>
        </div >
    )
}

export default Message