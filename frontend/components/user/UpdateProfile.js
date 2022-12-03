import { useState, useContext, useEffect } from "react"
import Router, { useRouter } from 'next/router'

import {toast} from 'react-toastify'

import AuthContext from '../../context/AuthContext'

const UpdateProfile = ({access_token}) => {
    const {updated, loading, user, clearErrors, error, updateProfile, setUpdated } = useContext(AuthContext) // Contenxt 

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const router = useRouter()

    useEffect(() => {
        if(user){
            setFirstName(user.first_name)
            setLastName(user.last_name)
            setEmail(user.email)
        }

        if(error){
          toast.error(error);
          clearErrors();
        }

        if(updated){
          setUpdated(false)
          router.push('/me')
        }
    
      }, [error, user, updated])
    
    const submitHandler = async (e) => {
        e.preventDefault();
        updateProfile({lastName, firstName, email, password}, access_token)
    }

  return (
    <div className="modalMask">
      <div className="modalWrapper">
        <div className="left">
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <img src="/images/signup.svg" alt="register" />
          </div>
        </div>
        <div className="right">
          <div className="rightContentWrapper">
            <div className="headerWrapper">
              <h2> Profile </h2>
            </div>
            <form className="form" onSubmit={submitHandler}>
              <div className="inputWrapper">
                <div className="inputBox">
                  <i aria-hidden className="fas fa-user"></i>
                  <input 
                  type="text"
                   placeholder="Enter First Name" 
                   value={firstName}
                   onChange={(e) => setFirstName(e.target.value)}
                   required />
                </div>

                <div className="inputBox">
                  <i aria-hidden className="fas fa-user-tie"></i>
                  <input 
                  type="text" 
                  placeholder="Enter Last name" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required />
                </div>

                <div className="inputBox">
                  <i aria-hidden className="fas fa-envelope"></i>
                  <input 
                  type="email" 
                  placeholder="Enter Your Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required />
                </div>
                <div className="inputBox">
                  <i aria-hidden className="fas fa-key"></i>
                  <input
                    type="password"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={4}
                  />
                </div>
              </div>
              <div className="registerButtonWrapper">
                <button type="submit" className="registerButton">
                {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateProfile