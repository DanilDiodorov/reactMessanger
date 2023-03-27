import React, {useContext, useRef, useState} from "react"
import {Button, Modal, Form, Alert, Spinner} from "react-bootstrap";
import {useCookies} from "react-cookie";
import axios from "axios";
import {StoreContext} from "../context";
import {addRoom} from "../redux/actions";
import useRoom from "../UseRoom";
import UseRoom from "../UseRoom";

export const AddFriend = ({show, handleClose}) => {
    const [cookie] = useCookies()
    const idRef = useRef()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {dispatch} = useContext(StoreContext)
    const {rooms} = useContext(StoreContext)

    function addHandler() {
        const friendId = idRef.current.value
        if (friendId.trim().length === 0){

        }
        else if (friendId === cookie.id){
            setError('Нельзя добавить себя')
        }
        else {
            let isFriend = false
            rooms.map(oneRoom => {
                if (oneRoom.friend.id === friendId){
                    setError('У вас уже есть этот друг')
                    isFriend = true
                }
            })
            if (isFriend === false){
                setLoading(true)
                axios.get(`user/addcheck/${friendId}`).then(data => {
                    if (data.data === false){
                        setError('Такого пользователя нет')
                        setLoading(false)
                    }
                    else {
                        const addData = {
                            user_1: cookie.id,
                            user_2: friendId
                        }
                        axios.post('room/add', addData).then(data => {
                            dispatch(addRoom([data.data]))
                            UseRoom([data.data], dispatch, cookie.id)
                                .then(() => {
                                    setLoading(false)
                                })
                            close()
                        })
                    }
                })
            }
        }
    }

    function close() {
        setError('')
        setLoading(false)
        handleClose()
    }

    return (
        <Modal show={show} onHide={close}>
            <Modal.Header closeButton>
                <Modal.Title>Добавить друга</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant='danger'>{error}</Alert>
                )}
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ID друга</Form.Label>
                    <Form.Control ref={idRef} type="text" placeholder={cookie.id} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={close}>
                    Отмена
                </Button>
                {loading ? (
                    <Button disabled variant="primary">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </Button>
                ) : (
                    <Button variant="primary" onClick={addHandler}>
                        Добавить
                    </Button>
                )}

            </Modal.Footer>
        </Modal>
    )
}
