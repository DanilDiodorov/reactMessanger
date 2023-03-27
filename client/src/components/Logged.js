import React, {useEffect, useState} from 'react'
import {Row} from "react-bootstrap";
import {Sidebar} from "./Sidebar";
import {Main} from "./Main";
import {useSpring, animated} from "react-spring";
import {ChatContext} from "../context";

const style = {
    height: '90%',
}

export const Logged = ({loading, rooms, setCurrentChat}) => {
    const [sideBar, setSideBar, stopSideBar] = useSpring(() => ({
        transform: 'translateX(-100%)'
    }))
    const [header, setHeader, stopHeader] = useSpring(() => ({
        transform: 'translateX(100%)'
    }))
    const [chat, setChat] = useState('')

    useEffect(() => {
        setCurrentChat(chat)
    }, [chat])

    useEffect(() => {
        if (loading === false){
            setSideBar({
                transform: 'translateX(0%)'
            })
            setHeader({
                transform: 'translateX(0%)'
            })
        }
        stopSideBar()
        stopHeader()
    }, [loading])

    return (
        <ChatContext.Provider value={{chat, setChat}}>
            <div style={style} className='row m-0 p-0'>
                <animated.div className='col-4 p-0 m-0 h-100' style={sideBar}>
                    <Sidebar rooms={rooms}/>
                </animated.div>
                <animated.div className='col p-0 m-0 h-100' style={header}>
                    <Main />
                </animated.div>
            </div>
        </ChatContext.Provider>
    )
}
