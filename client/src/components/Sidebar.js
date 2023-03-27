import React, {useContext, useEffect} from 'react'
import {OneUser} from "./OneUser"
import {StoreContext} from "../context";

const style = {
    borderRight: '1px solid #D0D0D0'
}

export const Sidebar = () => {
    const {rooms} = useContext(StoreContext)

    return (
        <div className='m-0 h-100 p-0' style={style}>
            {rooms !== [] ? rooms.map(oneRoom => (
                <OneUser
                    ava={oneRoom.friend.ava}
                    username={oneRoom.friend.username}
                    lastTextParam={oneRoom.messages[oneRoom.messages.length - 1] !== undefined ? oneRoom.messages[oneRoom.messages.length - 1].text : ''}
                    time={oneRoom.messages[oneRoom.messages.length - 1] !== undefined ? oneRoom.messages[oneRoom.messages.length - 1].time : ''}
                    id={oneRoom._id}
                    unReaded={oneRoom.unReaded}
                    />
            )) : (
               <div>У вам пока нет друзей</div>
            )}
        </div>
    )
}
