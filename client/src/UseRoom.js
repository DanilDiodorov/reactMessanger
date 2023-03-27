import axios from "axios";
import {addFriend, addLastMessage, addOneMessage, changeAllLoaded, setUnReaded} from "./redux/actions";

const UseRoom = async (rooms, dispatch, id) => {
    for (const oneRoom of rooms) {
        const friendId = oneRoom.user_1 !== id ? oneRoom.user_1 : oneRoom.user_2
        const findFriend = await axios.get(`user/friend/${friendId}`)
        dispatch(addFriend(oneRoom._id, findFriend.data))

        const findUnReadedData = {
            room_id: oneRoom._id,
            user_id: friendId
        }
        const findUnReaded = await axios.post('message/unreaded', findUnReadedData)
        console.log(findUnReaded.data)
        if (findUnReaded.data !== false){
            // dispatch(setUnReaded(oneRoom._id, findUnReaded.data.length))
            for (const oneMessage of findUnReaded.data){
                dispatch(addOneMessage(oneRoom._id, oneMessage))
            }
        }
        else {
            const findLastMessage = await axios.get(`message/findlast/${oneRoom._id}`)
            if (findLastMessage.data !== false){
                dispatch(addLastMessage(oneRoom._id, findLastMessage.data))
            }
            else {
                dispatch(changeAllLoaded(oneRoom._id))
            } 
        }
    }
}

export default UseRoom
