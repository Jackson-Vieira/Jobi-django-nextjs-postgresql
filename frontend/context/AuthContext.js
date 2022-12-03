import axios from 'axios';
import { useRouter } from 'next/router';
import {useState, useEffect, createContext} from 'react'

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error, setError] = useState(null);
    const [updated, setUpdated] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if(!user){
            loadUser()
        }
    }, [user])

    // Login user
    const login = async({username, password}) => {
        try {
            setLoading(true)
            const res = await axios.post('/api/auth/login', {
                username,
                password
            })

            if(res.data.success){
                setIsAuthenticated(true);
                setLoading(false);
                loadUser();
                router.push("/");
            }

        } catch (error) {
            setLoading(false)
            setError(error.response && (error.response.data || error.response.data.error))
        }
    };

    // Register user
    const register = async({firstName, lastName, email, password}) => {
        try {
            setLoading(true)
            const res = await axios.post(`${process.env.API_URL}/api/register/`, {
                first_name: firstName,
                last_name: lastName,
                password,
                email,
            })

            if(res.data.message){
                setLoading(false)
                router.push("/auth/login");
            }

        } catch (error) {
            setLoading(false)
            setError(error.response && (error.response.data.detail || error.response.data.error))
        }
    };


     // Update profile
     const updateProfile = async({firstName, lastName, email, password}, access_token) => {
        try {
            setLoading(true)
            const res = await axios.put(`${process.env.API_URL}/api/me/update`, {
                first_name: firstName,
                last_name: lastName,
                password,
                email,
            },
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
            )

            if(res.data){
                setLoading(false)
                setUser(res.data)
                router.push('/me')
            }

        } catch (error) {
            setLoading(false)
            setError(error.response && (error.response.data.message || error.response.data.error))
        }
    };

     // Logout user
     const logout = async() => {
        try {
            const res = await axios.post('/api/auth/logout')

            if(res.data.success){
                setIsAuthenticated(false);
                setUser(null)
            }

        } catch (error) {
            setIsAuthenticated(false)
            setUser(null)
            setError(error.response && (error.response.data.detail || error.response.data.error))
        }
    };

    // Load user
    const loadUser = async() => {
        try {
            setLoading(true)
            const res = await axios.get('/api/auth/user');
            if(res.data.success){
                setUser(res.data.user)
                setIsAuthenticated(true)
                setLoading(false)
                router.push("/")
            }

        } catch (error) {
            setLoading(false)
            setIsAuthenticated(false)
            setUser(null)
            setError(error.response && (error.response.data.detail || error.response.data.error))
        }
    }

    // Upload resume
    const uploadResume = async(access_token, formData) => {
        try {
            setLoading(true)
            const res = await axios.put(`${process.env.API_URL}/api/upload/resume/`, 
                formData,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
            )

            if(res.data){
                setLoading(false)
                setUploaded(true)
            }

        } catch (error) {
            setLoading(false)
            setError(error.response && (error.response.data.detail || error.response.data.error))
        }
    };

    // Clear Errors
    const clearErrors = () => {
        setError(null);
    };

    return (
        <AuthContext.Provider
            value = {{
                loading,
                user,
                error,
                isAuthenticated, 
                updated,
                uploaded,
                setUser,
                login,
                logout,
                loadUser,
                register,
                clearErrors,
                updateProfile,
                setUpdated,
                uploadResume,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext