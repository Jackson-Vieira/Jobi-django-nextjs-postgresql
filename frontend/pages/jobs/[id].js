import axios from "axios"
import Layout from "../../components/layout/Layout"
import JobDetail from "../../components/job/JobDetail"
import NotFound from "../../components/layout/NotFound"

export default function JobDetailsPage({job, error}) {
    if (error?.includes("Not found")) return <NotFound />

    return (
      <Layout title={job.title}>
        <JobDetail job={job} />
      </Layout>
    )
}

export async function getServerSideProps({params}) { 

  try {
    const res = await axios.get(`${process.env.API_URL}/api/jobs/${params.id}/`)
    const job = res.data
    return  {
        props: {
            job
        }
    }
  }

  catch (error ){
    return {
      props: {
        error: error.response.data.detail
      }
    }
  }
}