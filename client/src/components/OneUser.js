import React, {useContext, useEffect, useRef, useState} from 'react'
import Default from '../images/default.jpg'
import {ChatContext} from "../context";

const imageStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%'
}
const style = {
    width: '100%',
    listStyle: 'none',
    marginLeft: 0,
    paddingTop: '20px',
    paddingBottom: '20px',
    paddingRight: '10px',
    borderBottom: '1px solid rgb(0,0,0,0.05)'
}
const textColor = {
    color: 'grey',
}
const newMessageCount = {
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    color: 'white'
}

export const OneUser = ({ava, username, lastTextParam, time, id, unReaded}) => {
    const ref = useRef(null)
    const [size, setSize] = useState(null)
    const {setChat} = useContext(ChatContext)
    const [lastText, setLastText] = useState(lastTextParam)

    function chatHandler() {
        setChat(id)
    }

    useEffect(() => {
        setLastText(lastTextParam)
    }, [lastTextParam])

    useEffect(() => {
        let width = document.getElementById('lastText').clientWidth
        setSize(Math.round(width / 10))
        let listener = window.addEventListener('resize', () => {
            width = document.getElementById('lastText').clientWidth
            setSize(Math.round(width / 10))
        })
        return () => window.removeEventListener('resize', listener)
    }, [])

    useEffect(() => {
        if (lastText !== undefined){
            if (lastText.length > size){
                setLastText(lastTextParam.substr(0, size) + '...')
            }
        }
    }, [size, lastText])

    return (
        <div className='row m-0 one-user' style={style} onClick={() => chatHandler()} key={id}>
            <div className='col-2 p-0 d-flex justify-content-center align-items-center' key={id}>
                {ava !== '' ? (
                    <img src={ava} alt="" style={imageStyle}/>
                ) : (
                    <img src={Default} alt="" style={imageStyle}/>
                )}
            </div>
            <div className='col p-0'>
                <div>
                    {username}
                </div>
                <div ref={ref} style={textColor} id='lastText'>
                    {lastText}
                </div>
            </div>
            <div className='col-1 p-0 d-flex flex-column align-items-center justify-content-end'>
                <div>
                    {unReaded > 0 && (
                        <div className='d-flex justify-content-center align-items-center bg-info' style={newMessageCount}>
                            <div>{unReaded}</div>
                        </div>
                    )}
                </div>
                <div style={textColor}>
                    {time}
                </div>
            </div>
        </div>
    )
}
