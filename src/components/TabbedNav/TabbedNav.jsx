const React = require('react')
const hookUpStickyNav = require('../hookUpStickyNav')

class TabbedNav extends React.Component {
  isTasksActive() {
    const taskViews = ['tasks', 'hidden']
    return taskViews.indexOf(this.props.active) > -1
  }

  isFiltersActive() {
    const filterViews = ['filters', 'new-filter', 'edit-filter']
    return filterViews.indexOf(this.props.active) > -1
  }

  render() {
    const { active, user, isAuthenticated } = this.props
    return (
      <nav id="tabbed-nav" className="top-nav nav tabs is-toggle is-fullwidth">
        <ul>
          <li className={this.isTasksActive() ? 'is-active' : ''}>
            <button
              id="notifications-link"
              onClick={this.props.showTasks}
              className="button is-link"
              disabled={!isAuthenticated}
            >
              <span className="tab octicon octicon-mail"></span>
              <span>Tasks</span>
            </button>
          </li>
          <li className={this.isFiltersActive() ? 'is-active' : ''}>
            <button
              id="filters-link"
              onClick={this.props.manageFilters}
              className="button is-link"
              disabled={!isAuthenticated}
            >
              <span className="tab octicon octicon-beaker"></span>
              <span>Filters</span>
            </button>
          </li>
          <li className={active === 'auth' ? 'is-active' : ''}>
            <button
              id="auth-link"
              onClick={this.props.showAuth}
              className="button is-link"
            >
              {typeof user === 'object' ? (
                <span>
                  <span className="tab octicon octicon-mark-github"></span>
                  <span className="user-login">{user.login}</span>
                </span>
              ) : 'Authenticate'}
            </button>
          </li>
        </ul>
      </nav>
    )
  }
}

TabbedNav.propTypes = {
  user: React.PropTypes.object,
  manageFilters: React.PropTypes.func.isRequired,
  showAuth: React.PropTypes.func.isRequired,
  showTasks: React.PropTypes.func.isRequired,
  active: React.PropTypes.string,
  isAuthenticated: React.PropTypes.bool.isRequired,
}

module.exports = hookUpStickyNav(TabbedNav, '#tabbed-nav')
