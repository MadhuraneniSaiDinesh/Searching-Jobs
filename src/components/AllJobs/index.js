import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import {FaMapMarkerAlt, FaRegStar, FaSuitcase} from 'react-icons/fa'

import Header from '../Header'
import FilterDetails from '../FilterDetails'
import ProfileDetalis from '../ProfileDetalis'

import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    employeeType: [],
    minimumPackage: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {employeeType, minimumPackage, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeType.join(
      ',',
    )}&minimum_package=${minimumPackage}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    try {
      if (response.ok === true) {
        const data = await response.json()
        const updatedJobsData = data.jobs.map(eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          packagePerAnnum: eachJob.package_per_annum,
          rating: eachJob.rating,
          title: eachJob.title,
        }))
        this.setState({
          jobsList: updatedJobsData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (e) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeEmploymentType = type => {
    const {employeeType} = this.state
    const inputNotInList = employeeType.filter(eachItem => eachItem === type)
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({employeeType: [...prevState.employeeType, type]}),
        this.getJobs,
      )
    } else {
      const filteredData = employeeType.filter(eachItem => eachItem !== type)
      this.setState({employeeType: filteredData}, this.getJobs)
    }
  }

  changeSalaryRange = salary => {
    this.setState({minimumPackage: salary}, this.getJobs)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  onClickSearchButton = () => {
    this.getJobs()
  }

  renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        data-testid="button"
        className="jobs-failure-button"
        onClick={this.getJobs}
      >
        Retry
      </button>
    </div>
  )

  renderJobsListView = () => {
    const {jobsList} = this.state
    const shouldShowJobsList = jobsList.length > 0

    return shouldShowJobsList ? (
      <div className="all-jobs-container">
        <ul className="jobs-list">
          {jobsList.map(job => (
            <li className="job-item" key={job.id}>
              <Link to={`/jobs/${job.id}`} className="link-item">
                <div className="company-logo-container">
                  <img
                    src={job.companyLogoUrl}
                    alt="company logo"
                    className="company-logo"
                  />
                  <div className="title-rating-container">
                    <h1 className="title-heading">{job.title}</h1>
                    <div className="rating-container">
                      <FaRegStar className="rating-icon" />
                      <p className="rating-text">{job.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="location-package-container">
                  <div className="location-type-container">
                    <div className="location-container">
                      <FaMapMarkerAlt className="location-icon" />
                      <p className="location-text">{job.location}</p>
                    </div>
                    <div className="employment-type-container">
                      <FaSuitcase className="location-icon" />
                      <p className="location-text">{job.employmentType}</p>
                    </div>
                  </div>
                  <p className="package-text">{job.packagePerAnnum}</p>
                </div>
                <hr className="line" />
                <h1 className="description-heading">Description</h1>
                <p className="job-description">{job.jobDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-img"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="all-jobs-section">
          <div className="side-bar-container">
            <ProfileDetalis />
            <FilterDetails
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              changeEmploymentType={this.changeEmploymentType}
              changeSalaryRange={this.changeSalaryRange}
            />
          </div>
          <div className="jobs-content-container">
            <div className="search-input-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onClickSearchButton}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderAllJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default AllJobs
