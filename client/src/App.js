import 'bootstrap/dist/css/bootstrap.min.css'
import {Header} from "./components/Header";
import {Logged} from "./components/Logged";
import {UnLogged} from "./components/UnLogged";
import {useEffect, useReducer, useState} from "react";
import {useSpring, animated} from "react-spring";
import {Spring} from "react-spring/renderprops-universal";
import {ProgressBar, Spinner} from "react-bootstrap";
import './App.css'
import {addOneMessage, addProfile, addRoom, deleteRooms, updateStatus} from "./redux/actions";
import {profileReducer, roomReducer} from "./redux/reducers";
import {useCookies} from "react-cookie";
import axios from "axios";
import {StoreContext} from "./context";
import socket from "./socket";
import UseRoom from "./UseRoom";

const mainBlock = {
    width: '100vw',
    height: '100vh'
}

const loadingStyle = {
    top: 0,
    left: 0,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
}

let localRooms = []
let chat = ''

function App() {
    const [loading, setLoading] = useState(null)
    const [isLogged, setIsLogged] = useState(false)
    const [currentPage, setCurrentPage] = useState(true)
    const [cookie] = useCookies()
    const [progress, setProgress] = useState(0)

    const [rooms, dispatch] = useReducer(roomReducer,[])
    const [profile, profileDispatch] = useReducer(profileReducer, {})

    const [unLogged, setUnLogged, stopUnLogged] = useSpring(() => ({
        transform: 'translateY(100%)'
    }))

    async function getData() {
        const findRooms = await axios.get(`room/find/${cookie.id}`)
        setProgress(20)
        const findProfile = await axios.get(`user/profile/${cookie.id}`)
        setProgress(60)
        profileDispatch(addProfile(findProfile.data))
        if (findRooms.data !== false){
            dispatch(addRoom(findRooms.data))
            await UseRoom(findRooms.data, dispatch, cookie.id)
            setProgress(100)
        }
    }

    useEffect(() => {
        if (cookie.id !== '' && cookie.id){
            setIsLogged(true)
            setLoading(true)
            getData().then(() => {
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            })

        }
        else {
            setIsLogged(false)
        }
    }, [cookie])

    useEffect(() => {
        if (loading){
            setUnLogged({
                transform: 'translateY(100%)'
            })
        }
        else {
            setUnLogged({
                transform: 'translateY(0%)'
            })
        }
        stopUnLogged()
    }, [loading])

    useEffect(() => {
        socket.on('newMessage', data => {
            if (localRooms !== [] && cookie.id){
                localRooms.map(oneRoom => {
                    if (data.user_id === oneRoom.friend.id && data.room_id === oneRoom._id){
                        dispatch(addOneMessage(oneRoom._id, data, chat))
                    }
                })
            }
        })
        socket.on('updateStatus', data => {
            if (localRooms !== [] && cookie.id){
                localRooms.forEach(oneRoom => {
                    if (data.room_id === oneRoom._id && data.status){
                        oneRoom.messages.forEach(oneMessage => {
                            if (oneMessage.local_id === data.local_id && data.status >= oneMessage.status){
                                dispatch(updateStatus(data.room_id, data.local_id, data.status))
                            }
                        })
                    }
                })
            }
        })
        return () => {
            dispatch(deleteRooms())
            socket.removeAllListeners()
        }
    }, [])

    useEffect(() => {
        localRooms = rooms
        if (localRooms !== []){
            localRooms.map(oneRoom => {
                oneRoom.messages.map(oneMessage => {
                    if (oneMessage.user_id !== cookie.id && oneMessage.status === 1){
                        socket.emit('here', oneMessage._id)
                        dispatch(updateStatus(oneRoom._id, oneMessage.local_id, 2))
                    }
                })
            })
        }
        return () => {
            localRooms = []
        }
    }, [rooms])

    function changeCurrentPage(page) {
        setCurrentPage(page)
    }

    function setCurrentChat(curChat) {
        chat = curChat
    }

    return (
        <StoreContext.Provider value={{rooms, dispatch}}>
            <div style={mainBlock}>
                <Header isLogged={isLogged} changeCurrentPage={changeCurrentPage} currentPage={currentPage} loading={loading}/>
                {isLogged ? (
                    <Logged loading={loading} rooms={rooms} setCurrentChat={setCurrentChat}/>
                ) : (
                    <animated.div className='h-100' style={unLogged}>
                        <UnLogged currentPage={currentPage}/>
                    </animated.div>
                )}
                {loading === true ? (
                    <div style={loadingStyle}>
                        <Spring
                            from={{opacity: 0}}
                            to={{opacity: 1}}
                        >
                            {props => (
                                <div style={props} className='w-100 d-flex justify-content-center'>
                                    <div className='w-50 d-flex align-items-center flex-column'>
                                        <Spinner animation="border" role="status" variant='info'>
                                            <span className="sr-only">Loading...</span>
                                        </Spinner>
                                        <div className='w-75 m-5'>
                                            <ProgressBar now={progress} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Spring>
                    </div>
                ) : (
                    <div>
                    </div>
                )}
            </div>
        </StoreContext.Provider>
    )
}

export default App
