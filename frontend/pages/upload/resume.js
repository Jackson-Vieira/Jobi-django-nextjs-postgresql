import Layout from '../../components/layout/Layout'
import UploadResume from '../../components/user/UploadResume'
import { IsAuthenticatedUser } from '../../utils/isAuthenticated'

export default function Profile({access_token}) {
  return (
    <Layout title='Profile'>
      <UploadResume access_token={access_token}/>
    </Layout>
  )
}

export async function getServerSideProps({req}) { 

  const access_token = req.cookies.access;
  const user = await IsAuthenticatedUser(access_token);

  if (!user) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      }
    }
  }

  return {
    props: {
      access_token,
    }
  }
}