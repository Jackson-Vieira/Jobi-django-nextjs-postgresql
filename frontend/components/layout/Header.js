import React from 'react'
import Link from 'next/link'
import Image from 'next/image'


import { useContext } from 'react'
import AuthContext from '../../context/AuthContext'


const Header = () => {

  const {loading, user, logout} = useContext(AuthContext) // Contenxt API


  const logoutHandler = () => {
    logout()
  }

  return (
    <div className="navWrapper">
      <div className="navContainer">
        <Link href="/">
          <div className="logoWrapper">
            <div className="logoImgWrapper">
              <Image width="30" height="30" src="/images/logo.png" alt="" />
            </div>
            <span className="logo1">Jo</span>
            <span className="logo2">Bi</span>
          </div>
        </Link>
        <div className="btnsWrapper">
          <Link href="/employeer/jobs/new">
            <button className="postAJobButton">
              <span>Post A Job</span>
            </button>
          </Link>

          {user ? (
            <div className='btn dropdown-ml-3'>
              <a class="btn dropdown-toggle mr-4"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                <span>Hello, {user.first_name}</span>
              </a>
              <div className='dropdown-menu' aria-aria-labelledby='dropDownMenuButton'> 
              <Link href='/employeer/jobs'>
                <span className="dropdown-item">
                  My jobs
                </span>
              </Link>
              <Link href='/me/applied'>
                <span className="dropdown-item">
                  Jobs Applied
                </span>
              </Link>
              <Link href='/me'>
                <span className="dropdown-item">
                  Profile
                </span>
              </Link>
              <Link href='/upload/resume'>
                <span className="dropdown-item">
                  Upload Resume
                </span>
              </Link>

              <Link href='/'>
                <span className="dropdown-item text-danger" onClick={logoutHandler}>
                  Logout
                </span>
              </Link>
              </div>
            </div>
          ) : ( !loading && (
            <Link href="/auth/login">
            <button className="loginButtonHeader">
              <span>Login</span>
            </button>
          </Link>
          )
          )}
          
        </div>
      </div>
    </div>
  )
}

export default Header