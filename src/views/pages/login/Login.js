import React, { useState, useEffect } from "react"
import {
  CRow,
  CCol,
  CForm,
} from "@coreui/react"
import api from '../../../components/Api'
import { login, saveLocal, getSaveLocal } from '../../../components/Auth'
import logoAguia from './logo-aguia.png'
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Link
} from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { warningFn } from '../../../components/messages/Messages'
import './style.css'
import { useNavigate } from 'react-router-dom';


const Login = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false)
  const [remember, setRemember] = useState(false)
  const [eye, setEye] = useState(false)
  const paperStyle = {
    padding: 20,
    height: '450px',
    width: 400,
    margin: '80px auto',
    textAlign: 'center',
    borderRadius: '10px',
    overflow: 'hidden'
  }

  const btnstyle = {
    margin: '8px 0',
    backgroundColor: '#1bbd7e',
    color: 'white',
    fontWeight: 'bold'
  }

  const backgroundStyle = {
    height: '100vh',
    overflowX: 'hidden',
    zIndex: -1, // Colocar o fundo atrás de todo o conteúdo
    background:
      'linear-gradient(to bottom, white 50%, red 50%, red 55%, black 55%, black 100%)'
  }

  useEffect(() => {
    if (getSaveLocal('@email') !== null && getSaveLocal('@email') !== '') {
      setEmail(getSaveLocal('@email'))
      setRemember(true)
    } else {
      setEmail('')
      setRemember(false)
    }
  }, [])

  async function signIn(e) {
    e.preventDefault()
    setOpen(true)
    // if (!email || !password) {
    //   setFeedbackMsg('Preencha e-mail e senha para continuar!')
    //   return
    // }

    try {
      const form = new FormData()
      form.append('email', email)
      form.append('password', password)

      const response = await api.post('api/login', form)

      // on login success
      if (response.status === 200) {
        login(response.data.token)
        saveLocal('@name', response.data.user.name)
        saveLocal('@id', response.data.user.id)
        saveLocal('@super', response.data.user.super)
        if (remember) {
          saveLocal('@email', response.data.user.email)
        } else {
          localStorage.removeItem('@email')
        }
        navigate("/dashboard")
      }

      // on login Reject
    } catch (err) {
      console.log(err)
      if (err.status === 422) {
        setOpen(false)
        warningFn('Acesso Negado! Email ou Senha inválido')
        setPassword('')
      } else {
        warningFn('Erro desconhecido, contate o suporte!')
      }
    } finally {
      setOpen(false)
    }
  }

  function alteraRemember(e) {
    setRemember(e.target.checked)
  }

  function alteraEye() {
    setEye(prevState => !prevState)
  }


  return (

    <>
      <div style={{ position: 'fixed', zIndex: 1300 }}>
        <Backdrop open={open}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </div>
      <div className='containerStyle' style={backgroundStyle}>
        <h1
          style={{
            marginTop: '10px',
            color: 'black',
            textAlign: `center`,
            fontWeight: 'bold'
          }}
        >
          SIS ÁGUIA V 2.0.1
        </h1>
        <h4
          className='blinking'
          style={{
            color: '#a9a9a9',
            textAlign: `center`,
            fontWeight: 'bold'
          }}
        >
          ÁREA RESTRITA
        </h4>
        <Grid>
          <CForm onSubmit={(e) => signIn(e)}>
            <Paper elevation={10} style={paperStyle}>
              <Grid align='center'>
                <img
                  src={logoAguia}
                  style={{ width: '150px', height: 'auto' }}
                ></img>
              </Grid>
              <div style={{ margin: '5px' }}>
                <TextField
                  type='email'
                  label='Usuário'
                  placeholder='Digitar usuário'
                  fullWidth
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div style={{ margin: '5px' }}>
                <TextField
                  label='Senha'
                  type={eye ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={alteraEye}
                        >
                          {eye ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    name='checkedB'
                    checked={remember}
                    color='primary'
                    onChange={e => alteraRemember(e)}
                  />
                }
                label='Remember me'
              />

              <Button
                type='submit'
                variant='contained'
                style={btnstyle}
                fullWidth
              >
                Entrar
              </Button>
              <Typography>
                <Link href='#'>Esqueceu a senha ?</Link>
              </Typography>
              <Typography>
                {' '}
                Você não tem conta ?<Link href='#'> Cadastrar-se</Link>
              </Typography>
            </Paper>
          </CForm>

        </Grid>
      </div>
    </>

  )
}

export default Login
