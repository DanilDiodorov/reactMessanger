import React, {useEffect, useState} from 'react'
import {Navbar, Nav, Form, Button, Modal} from "react-bootstrap";
import {useSpring, animated} from "react-spring";
import {useCookies} from "react-cookie";
import {AddFriend} from "./AddFriend";

const style = {
    height: '100%',
    backgroundColor: '#F0F0F0'
}

const drop = {
    zIndex: 999
}

export const Header = ({isLogged, changeCurrentPage, currentPage, loading}) => {
    const [cookie, setCookie, removeCookie] = useCookies()
    const [header, setHeader, stopHeader] = useSpring(() => ({
        transform: `translateY(${isLogged ? 0 : '-100%'})`
    }))
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (loading){
            setHeader({
                transform: 'translateY(-110%)'
            })
        }
        else {
            setHeader({
                transform: 'translateY(0%)'
            })
        }
    }, [loading])

    function exit() {
        window.location = '/'
        removeCookie('id')
    }

    function addFriendHandler() {
        setShow(true)
    }
    const handleClose = () => setShow(false)

    return (
        <animated.div style={header}>
            <AddFriend show={show} handleClose={handleClose}/>
            <Navbar expand="lg"  style={style}>
                <Navbar.Brand href="#home"><h2>Messenger</h2></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {isLogged ? (
                            <>
                                <Nav.Link href="">Профиль</Nav.Link>
                                <Nav.Link href="" onClick={() => addFriendHandler()}>Добавить друга</Nav.Link>
                                <Nav.Link href="">Создать группу</Nav.Link>
                            </>
                        ) : (
                            <div>

                            </div>
                        )}
                    </Nav>
                    <Form inline>
                        {isLogged ? (
                            <div>
                                <Button
                                    variant="outline-info"
                                    className="mr-sm-2"
                                    onClick={() => exit()}
                                >Выход</Button>
                            </div>
                        ) : (
                            <div>
                                <Button
                                    variant="outline-info"
                                    className="mr-sm-2"
                                    onClick={() => changeCurrentPage(true)}
                                >Войти</Button>
                                <Button
                                    variant="outline-info"
                                    onClick={() => changeCurrentPage(false)}
                                >Регистрация</Button>
                            </div>
                        )}

                    </Form>
                </Navbar.Collapse>
            </Navbar>
        </animated.div>
    )
}
