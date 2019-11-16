import React, { useState } from 'react'
import loginService from '../services/login'
import { Form, Button, Grid } from 'semantic-ui-react'
import { withRouter } from 'react-router'

const LoginForm = props => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [disabled, setDisabled] = useState(false)

  const handleLogin = async event => {
    event.preventDefault()
    setDisabled(true)
    if (username.length === 0) {
      setDisabled(false)
      return props.handleNotification('error', 'Please enter your username')
    }

    if (password.length === 0) {
      setDisabled(false)
      return props.handleNotification('error', 'Please enter your password')
    }
    try {
      const loggedinUser = await loginService.login({
        username,
        password: password.toLowerCase()
      })
      window.localStorage.setItem(
        'real-cost-user',
        JSON.stringify(loggedinUser)
      )
      props.handleNotification(
        'success',
        `Nice, you're logged in! Let me take you to your expenses page`,
        2
      )
      setTimeout(() => {
        props.setLoggedinUser(loggedinUser)
        props.history.push('/expenses')
      }, 2000)
    } catch (exception) {
      props.handleNotification(
        'error',
        'Login failed. Check your username and/or password.',
        5
      )
      setDisabled(false)
    }
  }
  return (
    <div>
      <Form onSubmit={handleLogin}>
        <div>
          Username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div className='register__button'>
          <Button disabled={disabled} type='submit' positive>
            Log In
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default withRouter(LoginForm)
