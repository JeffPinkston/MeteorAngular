import React, { Component, PropTypes } from 'react';
import SelectPicker from 'react-select-picker';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hideCompleted: false,
			selectedType: 'Record'
		};
	}
	handleSubmit(event) {
		event.preventDefault();

		//find the text field via the React ref
		const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

		Meteor.call('tasks.insert', text);

		//clear form
		ReactDOM.findDOMNode(this.refs.textInput).value = '';
	}

	toggleHideCompleted() {
		this.setState({
			hideCompleted: !this.state.hideCompleted
		});
	}

	handleTypeChange(val) {
		this.setState({ selectedType: val });
	}

  renderTasks() {
		let filteredTasks = this.props.tasks;
		if(this.state.hideCompleted){
			filteredTasks = filteredTasks.filter(task => !task.checked);
		}
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>{this.state.selectedType} List ({this.props.incompleteCount})</h1>

					<AccountsUIWrapper />

						{ this.props.currentUser ?
	            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
							<SelectPicker
								className="select-type"
								defaultValue={this.state.selectedType}
								onChange={this.handleTypeChange.bind(this)}>
								<option>Record</option>
								<option>Concert</option>
								</SelectPicker>
	              <input
	                type="text"
	                ref="textInput"
	                placeholder="Type to add new tasks"
	              />

	            </form> : ''
	          }
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
	tasks: PropTypes.array.isRequired,
	incompleteCount: PropTypes.number.isRequired,
	currentUser: PropTypes.object
};

export default createContainer(() => {
	return {
		tasks: Tasks.find({}, {sort: {createdAt: -1} }).fetch(),
		incompleteCount: Tasks.find({checked: {$ne: true} }).count(),
		currentUser: Meteor.user()
	}
}, App);
