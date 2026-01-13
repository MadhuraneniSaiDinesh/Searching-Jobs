import './index.css'

const FilterDetails = props => {
  const {
    employmentTypesList,
    salaryRangesList,
    changeEmploymentType,
    changeSalaryRange,
  } = props

  const renderEmploymentTypesList = () =>
    employmentTypesList.map(eachType => {
      const onChangeEmploymentType = event => {
        changeEmploymentType(event.target.value)
      }

      return (
        <li className="filter-list-item" key={eachType.employmentTypeId}>
          <input
            type="checkbox"
            className="checkbox-input"
            id={eachType.employmentTypeId}
            value={eachType.employmentTypeId}
            onChange={onChangeEmploymentType}
          />
          <label htmlFor={eachType.employmentTypeId} className="filter-label">
            {eachType.label}
          </label>
        </li>
      )
    })

  const renderSalaryRangesList = () =>
    salaryRangesList.map(eachRange => {
      const onChangeSalary = () => {
        changeSalaryRange(eachRange.salaryRangeId)
      }

      return (
        <li className="filter-list-item" key={eachRange.salaryRangeId}>
          <input
            type="radio"
            className="checkbox-input"
            id={eachRange.salaryRangeId}
            name="salary"
            onChange={onChangeSalary}
          />
          <label htmlFor={eachRange.salaryRangeId} className="filter-label">
            {eachRange.label}
          </label>
        </li>
      )
    })

  return (
    <div className="filters-group-container">
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="filter-list">{renderEmploymentTypesList()}</ul>
      <hr className="separator" />
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="filter-list">{renderSalaryRangesList()}</ul>
    </div>
  )
}

export default FilterDetails
