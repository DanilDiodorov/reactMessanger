import React, {useContext, useEffect} from 'react'
import {ChatContext} from "../context";
import {MessageBlock} from "./MessageBlock";
import {MessageInput} from "./MessageInput";

const style = {
}

export const Main = () => {
    const {chat} = useContext(ChatContext)

    return (
        <div className='m-0 p-0 h-100' style={style}>
            {chat !== '' ? (
                <div className='h-100 d-flex flex-column'>
                    <MessageBlock chat={chat}/>
                    <MessageInput/>
                </div>
            ) : (
                <div />
            )}
        </div>
    )
}
