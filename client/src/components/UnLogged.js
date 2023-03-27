import React, {useEffect} from 'react'
import {Login} from "./Login";
import {SignIn} from "./SignIn";
import {useSpring, animated} from "react-spring";

const style = {
    height: '90%'
}

export const UnLogged = ({currentPage}) => {
    const [loginAnim, setLoginAnim, stopLoginAnim] = useSpring(() => ({
        width: '100vw',
        transform: 'translateX(50%)',
        opacity: 1
    }))
    const [signInAnim, setSignInAnim, stopSignInAnim] = useSpring(() => ({
        width: '100vw',
        transform: 'translateX(100%)',
        opacity: 0
    }))

    useEffect(() => {
        if (currentPage){
            setLoginAnim({transform: 'translateX(50%)', opacity: 1})
            setSignInAnim({transform: 'translateX(100%)', opacity: 0})
        }
        else {
            setLoginAnim({transform: 'translateX(-100%)', opacity: 0})
            setSignInAnim({transform: 'translateX(-50%)', opacity: 1})
        }
        stopLoginAnim()
        stopSignInAnim()
    }, [currentPage])

    return (
        <div className='d-flex align-items-center bg-light' style={style}>

            <animated.div style={loginAnim} className='d-flex justify-content-center'>
                <Login />
            </animated.div>

            <animated.div style={signInAnim} className='w-100 d-flex justify-content-center'>
                <SignIn />
            </animated.div>

        </div>
    )
}
