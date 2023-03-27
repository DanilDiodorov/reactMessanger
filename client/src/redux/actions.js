export const addRoom = (rooms) => {
    return {
        type: 'addRoom',
        payload: {
            rooms
        }
    }
}

export const addMessage = (roomId, messages) => {
    return {
        type: 'addMessage',
        payload: {
            roomId,
            messages
        }
    }
}

export const addOneMessage = (roomId, message, currentChat) => {
    return {
        type: 'addOneMessage',
        payload: {
            roomId,
            message,
            currentChat: currentChat
        }
    }
}

export const addLastMessage = (roomId, lastMessage) => {
    return {
        type: 'addLastMessage',
        payload: {
            roomId,
            lastMessage
        }
    }
}

export const addFriend = (roomId, friend) => {
    return {
        type: 'addFriend',
        payload: {
            roomId,
            friend
        }
    }
}

export const addProfile = (profile) => {
    return {
        type: 'addProfile',
        payload: {
            profile
        }
    }
}

export const changeLoaded = (roomId) => {
    return {
        type: 'loaded',
        payload: {
            roomId
        }
    }
}

export const changeAllLoaded = (roomId) => {
    return {
        type: 'allLoaded',
        payload: {
            roomId
        }
    }
}

export const changeRoom = (roomId) => {
    return {
        type: 'changeRoom',
        payload: {
            roomId
        }
    }
}

export const updateStatus = (roomId, localId, status) => {
    return {
        type: 'updateStatus',
        payload: {
            roomId,
            localId,
            status
        }
    }
}

export const setUnReaded = (roomId, unReaded) => {
    return {
        type: 'setUnReaded',
        payload: {
            roomId,
            unReaded
        }
    }
}

export const removeUnReaded = (roomId) => {
    return {
        type: 'removeUnReaded',
        payload: {
            roomId
        }
    }
}

export const deleteRooms = () => {
    return {
        type: 'deleteRooms'
    }
}
