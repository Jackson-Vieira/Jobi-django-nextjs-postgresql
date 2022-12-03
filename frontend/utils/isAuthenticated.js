import axios from 'axios'



export const IsAuthenticatedUser = async (access_token) => {
    try {
        const  reponse = await axios.post(`${process.env.API_URL}/api/token/verify/`, {
            token: access_token
        })

        if (reponse.status == 200) return true
        return false
    } catch (error) {
        return false
    }
}