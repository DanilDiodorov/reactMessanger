import React, {useRef, useState} from 'react'
import {Alert, Button, Card, Form, Spinner} from "react-bootstrap";
import axios from "axios"
import {useCookies} from 'react-cookie'

const style = {
    width: '80%'
}

export const SignIn = () => {
    const email = useRef('')
    const username = useRef('')
    const password = useRef('')
    const password_2 = useRef('')
    const [error, setError] = useState(null)
    const [cookie, setCookie] = useCookies()
    const [loading, setLoading] = useState(false)

    function signInHandler() {
        const findData = {
            email: email.current.value.trim(),
            username: username.current.value.trim(),
            password: password.current.value.trim()
        }
        if (findData.username.length < 5){
            setError('Имя пользователя должна быть не менее 5 символов')
        }
        else if (findData.email.length < 5){
            setError('Email должен быть не менее 5 символов')
        }
        else if (findData.password.length < 6){
            setError('Пароль должен быть не менее 6 символов')
        }
        else if (password_2.current.value.trim() === 0){
            setError('Введите повторный пароль')
        }
        else if (password_2.current.value.trim() !== findData.password){
            setError('Пароли не совпадают')
        }
        else {
            const addData = {
                email: findData.email,
                username: findData.username,
                password: findData.password
            }
            setLoading(true)
            axios.post('/user/check', {email: findData.email, username: findData.username}).then(data => {
                if (data.data !== true){
                    setError(data.data)
                    setLoading(false)
                }
                else {
                    setLoading(true)
                    axios.post('/user/add', findData).then(id => {
                        setLoading(false)
                        setCookie('id', id.data)
                    })
                }
            })
        }
    }
    return (
        <div style={style}>
            <Card style={{ width: '100%' }}>
                <Card.Body>
                    <Card.Title><h2>Регистрация</h2></Card.Title>
                    <Card.Subtitle>
                        {error && (
                            <Alert variant='danger'>
                                {error}
                            </Alert>
                        )}
                    </Card.Subtitle>
                    <Card.Text>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control ref={email} type="email" placeholder="Введите email" />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Имя пользователя</Form.Label>
                                <Form.Control ref={username} type="email" placeholder="Введите имя пользователя" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control ref={password} type="password" placeholder="Введите пароль" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Повтрный пароль</Form.Label>
                                <Form.Control ref={password_2} type="password" placeholder="Введите повторный пароль" />
                            </Form.Group>
                            {loading ? (
                                <Button variant="primary" type="button" disabled>
                                    <Spinner animation='grow' variant='info' size='sm' />
                                    <Spinner animation='grow' variant='info' size='sm' />
                                    <Spinner animation='grow' variant='info' size='sm' />
                                </Button>
                            ) : (
                                <Button variant="primary" type="button" onClick={() => signInHandler()}>
                                    Зарегистрироваться
                                </Button>
                            )}
                        </Form>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}
