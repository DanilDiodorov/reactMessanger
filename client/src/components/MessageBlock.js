import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import {OneMessage} from "./OneMessage"
import {ChatContext, StoreContext} from "../context";
import {useCookies} from "react-cookie";
import {addMessage, addOneMessage, changeAllLoaded, changeLoaded, removeUnReaded} from "../redux/actions";
import axios from "axios";
import {Spinner} from "react-bootstrap";
import socket from '../socket';

let skipCount = 0
let isFirst = true
let allLoaded = false
let canScroll = false
let currentChat = ''
let canScrollToLast = false

export const MessageBlock = () => {
    const messageRef = useRef(null)
    const [cookie] = useCookies()
    const {rooms, dispatch} = useContext(StoreContext)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const {chat} = useContext(ChatContext)

    useEffect(() => {
        if (currentChat !== ''){
            let lastMessage = Math.ceil(document.getElementById('messageBlock').scrollTop + document.getElementById('messageBlock').clientHeight)
            let scroll = document.getElementById('messageBlock').scrollHeight
            if (scroll - lastMessage < 30){
                canScroll = true
            }
            rooms.forEach(oneRoom => {
                if (oneRoom._id === chat){
                    allLoaded = oneRoom.allLoaded
                    setMessages([...oneRoom.messages])
                    if (oneRoom.unReaded !== 0){
                        dispatch(removeUnReaded(currentChat))
                    }
                    oneRoom.messages.forEach(oneMessage => {
                        if (oneMessage.status === 2 && oneMessage.user_id !== cookie.id){
                            socket.emit('readed', oneMessage._id)
                        }
                    })
                }
            })
        }
    }, [rooms])

    useEffect(() => {
        if (currentChat !== ''){
            skipCount = messages.length
            console.log(skipCount)
            if (isFirst){
                messageRef.current.scrollIntoView()
                isFirst = false
            }
            else if (canScroll){
                messageRef.current.scrollIntoView()
                canScroll = false
            }
            else if (canScrollToLast){
                document.getElementById('messageBlock').scrollTop = document.getElementById('scroll').offsetTop
                canScrollToLast = false
            }
            // else if (messages[messages.length - 1].user_id === cookie.id){
            //     messageRef.current.scrollIntoView({behavior: 'smooth'})
            // }
        }
    }, [messages])

    useEffect(() => {
        if (chat !== ''){
            currentChat = chat
            if (rooms !== []){
                rooms.forEach(oneRoom => {
                    if (oneRoom._id === chat){
                        allLoaded = oneRoom.allLoaded
                        skipCount = oneRoom.messages.length
                        setMessages([...oneRoom.messages])
                        oneRoom.messages.forEach(oneMessage => {
                            if (oneMessage.status === 2 && oneMessage.user_id !== cookie.id){
                                socket.emit('readed', oneMessage._id)
                            }
                        })
                    }
                })
            }
            let loaded = false
            rooms.forEach(oneRoom => {
                if (oneRoom._id === chat){
                    loaded = oneRoom.loaded
                }
            })
            if (loaded === false && allLoaded === false){
                const findData = {
                    room_id: chat,
                    skip: skipCount,
                    limit: 20
                }
                setLoading(true)
                axios.post('message/find', findData).then(data => {
                    if (data.data !== false){
                        dispatch(addMessage(chat, data.data))
                        setLoading(false)
                        if (data.data.length < 20){
                            dispatch(changeAllLoaded(currentChat))
                        }
                    }
                    else {
                        setLoading(false)
                    }
                    dispatch(changeLoaded(chat))
                })
            }
        }


        return () => {
            skipCount = 0
            isFirst = true
            allLoaded = false
            canScroll = false
            canScrollToLast = false
        }
    }, [chat])

    useEffect(() => {
        let messageBlcok = document.getElementById('messageBlock')
        let listener = (e) => {
            if (e.target.scrollTop === 0 && currentChat  !== '' && e.target.scrollHeight > e.target.clientHeight){
                const findData = {
                    room_id: currentChat,
                    skip: skipCount,
                    limit: 20
                }
                if (allLoaded === false){
                    setLoading(true)
                    axios.post('message/find', findData).then(data => {
                        if (data.data !== false && data.data !== null){
                            data.data[data.data.length - 1].isLast = true
                            canScrollToLast = true
                            dispatch(addMessage(currentChat, data.data))
                            setLoading(false)
                            if (data.data.length < 20){
                                dispatch(changeAllLoaded(currentChat))
                            }
                        }
                        else {
                            allLoaded = true
                            setLoading(false)
                        }
                    })
                }
            }
        }

        messageBlcok.addEventListener('scroll', listener)
    }, [])

    return (
        <div className='w-100 p-1' style={{flexBasis: '90%', overflow: 'auto'}} id='messageBlock'>
            {loading && (
                <div className='d-flex justify-content-center mt-3'>
                    <Spinner animation="grow" size='sm' variant='info'/>
                    <Spinner animation="grow" size='sm' variant='info'/>
                    <Spinner animation="grow" size='sm' variant='info'/>
                </div>
            )}
            {messages !== [] ? messages.map(oneMessage => {
                if (oneMessage.isLast){
                    return (
                        <OneMessage
                            id='scroll'
                            text={oneMessage.text}
                            time={oneMessage.time}
                            isMy={oneMessage.user_id === cookie.id}
                            status={oneMessage.status}
                            key={oneMessage.local_id}
                        />
                    )
                }
                else {
                    return (
                        <OneMessage
                            text={oneMessage.text}
                            time={oneMessage.time}
                            isMy={oneMessage.user_id === cookie.id}
                            status={oneMessage.status}
                            key={oneMessage.local_id}
                        />
                    )
                }
            }) : (<div />)}
            <div ref={messageRef} id='lastMessage' />
        </div>
    )
}
