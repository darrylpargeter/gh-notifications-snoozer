const { connect } = require('react-redux')
const React = require('react')
const { ipcRenderer } = require('electron')

const Filter = require('../../models/filter')
const Filters = require('../../models/filters')
const GitHub = require('../../models/github')
const AppMenu = require('../../models/app-menu')
const TopNavigation = require('../TopNavigation')
const TaskList = require('../TaskList')
const FilterList = require('../FilterList')
const NewFilter = require('../NewFilter')
const Config = require('../../config.json')
const About = require('../About')

class App extends React.Component {
  constructor() {
    super()
    this.state = { view: 'tasks', filters: Filters.findAll() }
  }

  componentDidMount() {
    ipcRenderer.send('title', 'Notifications')
    if (this.state.filters.length > 0) {
      this.loadFilter(this.state.filters[0])
    } else {
      this.loadTasks(Config.searchQuery)
    }
    this.setupAppMenu()
  }

  setupAppMenu() {
    const menu = new AppMenu()
    menu.on('about-app', () => {
      ipcRenderer.send('title', 'About')
      this.setState({ view: 'about' })
    })
  }

  loadTasks(query) {
    const github = new GitHub()
    github.getTasks(query).then(tasks => {
      this.props.dispatch({ type: 'TASKS_UPDATE', tasks })
    })
  }

  showNewFilterForm() {
    ipcRenderer.send('title', 'New Filter')
    this.setState({ view: 'new-filter' })
  }

  savedFilter() {
    ipcRenderer.send('title', 'Notifications')
    this.setState({ view: 'tasks', filters: Filters.findAll() })
  }

  showTaskList() {
    ipcRenderer.send('title', 'Notifications')
    this.setState({ view: 'tasks' })
  }

  loadFilter(key) {
    this.props.dispatch({ type: 'TASKS_EMPTY' })
    const filter = new Filter(key)
    const query = filter.retrieve()
    this.loadTasks(query)
  }

  manageFilters() {
    ipcRenderer.send('title', 'Manage Filters')
    this.setState({ view: 'filters' })
  }

  deleteFilter(key) {
    const filter = new Filter(key)
    const remainingFilters = filter.delete()
    this.setState({ filters: remainingFilters })
  }

  render() {
    if (this.state.view === 'tasks') {
      return (
        <div className="tasks-view">
          <TopNavigation
            addFilter={() => this.showNewFilterForm()}
            changeFilter={key => this.loadFilter(key)}
            manageFilters={() => this.manageFilters()}
          />
          <TaskList />
        </div>
      )
    }

    if (this.state.view === 'filters') {
      return (
        <FilterList
          filters={this.state.filters}
          delete={key => this.deleteFilter(key)}
          addFilter={() => this.showNewFilterForm()}
          cancel={() => this.showTaskList()}
        />
      )
    }

    if (this.state.view === 'about') {
      return (
        <About
          cancel={() => this.showTaskList()}
        />
      )
    }

    return (
      <NewFilter
        save={() => this.savedFilter()}
        cancel={() => this.showTaskList()}
      />
    )
  }
}

App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
}

module.exports = connect()(App)
