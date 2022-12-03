import axios from 'axios'
import cookie from 'cookie'

export default async (req, res ) => {
    if (req.method === 'GET'){

        const cookies = cookie.parse(req.headers.cookie || '')
        const access = cookies.access || false

        if(!access) {
            return res.status(401).json({
                error: 'Login first to load user'
            })
        }

        try {
            const response = await axios.get(`${process.env.API_URL}/api/me/`, {
                    headers: {
                        'Authorization': `Bearer ${access}`
                    }
                }
            )
            if(response.data) {
                return res.status(200).json(
                    {
                        user: response.data,
                        success: true,
                    }
                )
            }

            
        } catch (error) {
            res.status(500).json({
                error: 'Ops!'
            })
    }
}}