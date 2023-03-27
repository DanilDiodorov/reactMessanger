import React, {useContext, useEffect, useRef, useState} from 'react'
import {ChatContext, StoreContext} from "../context";
import {useCookies} from "react-cookie";
import {addMessage, addOneMessage, changeRoom} from "../redux/actions";
import socket from "../socket";

let currentChat = ''

export const MessageInput = () => {
    const [size, setSize] = useState(0)
    const [cookie, setCookie] = useCookies()
    const {dispatch} = useContext(StoreContext)
    const textRef = useRef('')
    const {chat} = useContext(ChatContext)
    const textStyle = {
        width: '95%',
        resize: 'none',
        height: '70%',
        padding: '10px',
        borderRadius: '20px',
        outline: 'none',
        borderColor: '#C0C0C0'
    }

    function sendHandler() {
        if (textRef.current !== null){
            const text = textRef.current.value.trim()
            if (text !== ''){
                const date = new Date()
                const message = {
                    local_id: Date.now().toString(),
                    room_id: currentChat,
                    user_id: cookie.id,
                    status: 0,
                    text,
                    time: date.getHours() + ':' + date.getMinutes()
                }
                dispatch(changeRoom())
                dispatch(addOneMessage(currentChat, message))
                socket.emit('message', message)
                textRef.current.value = ''
                setSize(0)
            }
        }
    }

    useEffect(() => {
        let listener
        currentChat = chat
        if (currentChat !== ''){
            listener = document.addEventListener('keypress', (e) => {
                if (e.keyCode === 13){
                    e.preventDefault()
                    sendHandler()
                }
            })
        }
        return () => document.removeEventListener('keypress', listener)
    }, [chat])

    useEffect(() => {
        if (size >= 50){
            document.getElementById('messageBlock').scrollTop = document.getElementById('messageBlock').scrollHeight
            
        }
    }, [size])

    return (
        <div className='d-flex justify-content-end pl-2 pr-2' id='textarea' style={{flexBasis: size < 50 ? '10%' : '30%', backgroundColor: '#F0F0F0'}}>
            <div className='h-100 d-flex w-100 align-items-center'>
                <textarea onChange={(e) => setSize(e.target.value.length)} ref={textRef} style={textStyle} placeholder='Введите сообщение'/>
                <img className='send' onClick={() => sendHandler()} src="https://img.icons8.com/dotty/80/000000/paper-plane.png" alt='send' style={{width: '5%'}}/>
            </div>
        </div>
    )
}
