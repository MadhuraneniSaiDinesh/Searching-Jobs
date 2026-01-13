import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {
  FaMapMarkerAlt,
  FaRegStar,
  FaExternalLinkAlt,
  FaSuitcase,
} from 'react-icons/fa'

import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
    title: data.title,
  })

  getFormattedSimilarData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getJobData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data.job_details)
      const updatedSimilarJobsData = data.similar_jobs.map(eachSimilarJob =>
        this.getFormattedSimilarData(eachSimilarJob),
      )
      this.setState({
        jobData: updatedData,
        similarJobsData: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="job-item-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-item-failure-img"
      />
      <h1 className="job-item-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="job-item-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        id="button"
        className="job-item-failure-button"
        onClick={this.getJobData}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetailsView = () => {
    const {jobData, similarJobsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobData

    return (
      <div className="job-details-view-container">
        <div className="job-item">
          <div className="company-logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="title-rating-container">
              <h1 className="title-heading">{title}</h1>
              <div className="rating-container">
                <FaRegStar className="rating-icon" />
                <p className="rating-text">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-package-container">
            <div className="location-type-container">
              <div className="location-container">
                <FaMapMarkerAlt className="location-icon" />
                <p className="location-text">{location}</p>
              </div>
              <div className="employment-type-container">
                <FaSuitcase className="location-icon" />
                <p className="location-text">{employmentType}</p>
              </div>
            </div>
            <p className="package-text">{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <div className="description-visit-container">
            <h1 className="description-heading">Description</h1>
            <div className="visit-container">
              <a href={companyWebsiteUrl} className="visit-heading">
                Visit
              </a>
              <FaExternalLinkAlt className="visit-icon" />
            </div>
          </div>
          <p className="job-description">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list-container">
            {skills.map(eachSkill => (
              <li className="skill-item-container" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-image"
                />
                <p className="skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="life-at-company-description">
              {lifeAtCompany.description}
            </p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobsData.map(eachSimilarJob => (
            <li className="similar-job-item" key={eachSimilarJob.id}>
              <div className="company-logo-container">
                <img
                  src={eachSimilarJob.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div className="title-rating-container">
                  <h1 className="title-heading">{eachSimilarJob.title}</h1>
                  <div className="rating-container">
                    <FaRegStar className="rating-icon" />
                    <p className="rating-text">{eachSimilarJob.rating}</p>
                  </div>
                </div>
              </div>
              <h1 className="description-heading">Description</h1>
              <p className="job-description">{eachSimilarJob.jobDescription}</p>
              <div className="location-type-container">
                <div className="location-container">
                  <FaMapMarkerAlt className="location-icon" />
                  <p className="location-text">{eachSimilarJob.location}</p>
                </div>
                <div className="employment-type-container">
                  <FaMapMarkerAlt className="location-icon" />
                  <p className="location-text">
                    {eachSimilarJob.employmentType}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="job-item-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state

    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {apiStatus === apiStatusConstants.success &&
            this.renderJobDetailsView()}
          {apiStatus === apiStatusConstants.failure && this.renderFailureView()}
          {apiStatus === apiStatusConstants.inProgress &&
            this.renderLoadingView()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
