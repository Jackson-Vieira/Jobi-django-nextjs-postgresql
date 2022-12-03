import Image from "next/image"
import Link from "next/link"

import { useState, useContext, useEffect } from "react"

import {toast} from 'react-toastify'

import { useRouter } from "next/router"

import AuthContext from '../../context/AuthContext'

const UploadResume = ({access_token}) => {

  const router = useRouter()
  const [resume, setResume] = useState(null)
  const {loading, user, clearErrors, error, uploadResume, uploaded } = useContext(AuthContext);

  useEffect(() => {
    if(error){
      toast.error(error);
      clearErrors();
    }

    if(uploaded){
      toast.success('Your resume is uploaded successfully.')
    }

  }, [error, uploaded])


  const submitHandler = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('resume', resume)
    uploadResume(access_token, formData)
  }

  const onChange = (e) => {
    setResume(e.target.files[0])
  }

  return (
    <div className="modalMask">
      <div className="modalWrapper">
        <div className="left">
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Image src="/images/resume-upload.svg" alt="resume" layout="fill"/>
          </div>
        </div>
        <div className="right">
          <div className="rightContentWrapper">
            <div className="headerWrapper">
              <h3> UPLOAD RESUME </h3>
            </div>
            <form clsName="form" onSubmit={submitHandler}>
              <div className="inputWrapper">
                <div className="inputBox">
                  <i aria-hidden className="fas fa-upload"></i>
                  <input
                    type="file"
                    name="resume"
                    id="customFile"
                    accept="application/pdf"
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              {user && user.resume && (
              <>
                <h4 className="text-center my-3">OR</h4>
                <Link href={`https://jobbeebucket.s3.sa-east-1.amazonaws.com/${user.resume}`}>
                  <span
                    className="text-success text-center ml-4"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <b>
                      <i aria-hidden className="fas fa-download"></i> Download
                      Your Resume
                    </b>
                  </span>
                </Link>
              </>
              )}

              <div className="uploadButtonWrapper">
                <button type="submit" className="uploadButton">
                  {loading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadResume