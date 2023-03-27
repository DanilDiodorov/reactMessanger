import axios from "axios";

export const roomReducer = (state = [], action) => {
    switch (action.type){
        case 'deleteRooms':
            state = []
            return state
        case 'addRoom':
            action.payload.rooms.map(oneRoom => {
                oneRoom.messages = []
                oneRoom.friend = {}
                oneRoom.loaded = false
                oneRoom.allLoaded = false
                oneRoom.unReaded = 0
            })
            return state.concat(action.payload.rooms)
        case 'addMessage':
            let newState3 = [...state]
            newState3.map(oneRoom => {
                if (oneRoom._id === action.payload.roomId){
                    oneRoom.messages = action.payload.messages.concat(oneRoom.messages)
                }
                return oneRoom
            })
            return newState3
        case 'addOneMessage':
            let newState = [...state]
            newState.map(oneRoom => {
                if (oneRoom._id === action.payload.roomId){
                    oneRoom.messages.push(action.payload.message)
                    oneRoom.time = Date.now()
                    axios.get(`/room/time/${oneRoom._id}`)
                    if (action.payload.message.status === 1 && action.payload.message.user_id === oneRoom.friend.id && action.payload.currentChat !== oneRoom._id){
                        oneRoom.unReaded = oneRoom.unReaded + 1
                        console.log('Onee')
                    }
                }
                return oneRoom
            })
            newState.sort((a, b) => {
                return a.time - b.time
            })
            newState.reverse()
            return newState
        case 'addLastMessage':
            state.map(oneRoom => {
                if (oneRoom._id === action.payload.roomId){
                    oneRoom.messages = action.payload.lastMessage
                }
                return oneRoom
            })
            state.sort((a, b) => {
                return a.time - b.time
            })
            state.reverse()
            return state
        case 'addFriend':
            return state.map(oneRoom => {
                if (oneRoom._id === action.payload.roomId){
                    oneRoom.friend = action.payload.friend
                }
                return oneRoom
            })
        case 'updateStatus':
            let newState2 = [...state]
            newState2.map(oneRoom => {
                if (oneRoom._id === action.payload.roomId){
                    return oneRoom.messages.map(oneMessage => {
                        if (oneMessage.local_id === action.payload.localId){
                            oneMessage.status = action.payload.status
                        }
                        return oneMessage
                    })
                }
            })
            return newState2
        case 'setUnReaded':
            return state.map(oneRoom => {
                if (oneRoom._id === action.payload.roomId){
                    oneRoom.unReaded = action.payload.unReaded
                }
                return oneRoom
            })
        case 'removeUnReaded':
            return state.map(oneRoom => {
                if (oneRoom._id === action.payload.roomId){
                    oneRoom.unReaded = 0
                }
                return oneRoom
            })
        case 'loaded':
            return state.map(oneRoom => {
                if (oneRoom._id === action.payload.roomId){
                    oneRoom.loaded = true
                }
                return oneRoom
            })
        case 'allLoaded':
            return state.map(oneRoom => {
                if (oneRoom._id === action.payload.roomId){
                    oneRoom.allLoaded = true
                }
                return oneRoom
            })
        default:
            return state
    }
}

export const profileReducer = (state, action) => {
    switch (action.type){
        case 'addProfile':
            return action.payload.profile
        default:
            return state
    }
}
