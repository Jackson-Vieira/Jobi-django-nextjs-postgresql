import React from 'react'
import Link from 'next/link'

import moment from 'moment'


const JobItem = ({job}) => {
  return (
    <Link href={`/jobs/${job.id}`}>
      <span className="job-listing">
        <div className="job-listing-details">
          <div className="job-listing-description">
            <h4 className="job-listing-company">{job.industry}</h4>
            <h3 className="job-listing-title">{job.title}</h3>
            <p className="job-listing-text">
              {job.description.substring(0, 200)}...
            </p>
          </div>

          <span className="bookmark-icon"></span>
        </div>

        <div className="job-listing-footer">
          <ul>
            <li>
              <i aria-hidden className="fas fa-industry"></i> {job.industry}
            </li>

            <li>
              <i aria-hidden className="fas fa-briefcase"></i> {job.jobType}
            </li>
            <li>
              <i aria-hidden className="fas fa-money-check-alt"></i>${job.salary}
            </li>
            <li>
              <i aria-hidden className="far fa-clock"></i> 
              {moment.utc(job.createAt).local().startOf("seconds").fromNow()}
            </li>
          </ul>
        </div>
      </span>
    </Link>
  )
}

export default JobItem