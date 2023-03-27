import React, {useRef, useState} from 'react'
import {Button, Card, Form, Alert, Spinner} from "react-bootstrap";
import axios from "axios";
import {useCookies} from "react-cookie";

const style = {
    width: '80%'
}

export const Login = () => {
    const email = useRef('')
    const password = useRef('')
    const [error, setError] = useState(null)
    const [cookie, setCookie] = useCookies()
    const [loading, setLoading] = useState(false)

    function loginHandler() {
        const findData = {
            email: email.current.value.trim(),
            password: password.current.value.trim()
        }
        if (findData.email.length === 0){
            setError('Введите email')
        }
        else if (findData.password.length === 0){
            setError('Введите пароль')
        }
        else {
            setLoading(true)
            axios.post('/user/login', findData)
                .then(data => {
                    setLoading(false)
                    if (data.data === false){
                        setError('Такого пользователя нет')
                    }
                    else {
                        setCookie('id', data.data)
                    }
                })
        }
    }

    return (
        <div style={style}>
            <Card style={{ width: '100%' }}>
                <Card.Body>
                    <Card.Title><h2>Вход</h2></Card.Title>
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

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control ref={password} type="password" placeholder="Введите пароль" />
                            </Form.Group>
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="Запоминить меня" />
                            </Form.Group>
                            {loading ? (
                                <Button variant="primary" type="button" disabled>
                                    <Spinner animation='grow' variant='info' size='sm' />
                                    <Spinner animation='grow' variant='info' size='sm' />
                                    <Spinner animation='grow' variant='info' size='sm' />
                                </Button>
                            ) : (
                                <Button variant="primary" type="button" onClick={() => loginHandler()}>
                                    Войти
                                </Button>
                            )}
                        </Form>
                    </Card.Text>
                    <Card.Link>Забыли пароль?</Card.Link>
                </Card.Body>
            </Card>
        </div>
    )
}
