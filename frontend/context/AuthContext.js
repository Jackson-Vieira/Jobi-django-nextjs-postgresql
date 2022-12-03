import axios from 'axios';
import { useRouter } from 'next/router';
import {useState, useEffect, createContext} from 'react'

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error, setError] = useState(null);

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
            console.log(1)
            setLoading(false)
            setIsAuthenticated(false)
            setUser(null)
            setError(error.response && (error.response.data.detail || error.response.data.error))
        }
    }

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
                login,
                logout,
                loadUser,
                register,
                clearErrors,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext