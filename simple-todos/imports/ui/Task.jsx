import React, { Component, PropTypes } from 'react';

import { Tasks } from '../api/tasks.js';

//Task component - represents a single todo item
export default class Task extends Component {
  toggleChecked() {
    //Set the checked property to teh opposite of its current value
    Tasks.update(this.props.task._id, {
      $set: {checked: !this.props.task.checked }
    });
  }

  deleteThisTask(){
      Tasks.remove(this.props.task._id);
  }

  render() {
    //Give tasks a different className when they are checked off,
    //so that we can style them nicely in className
    const taskClassName = this.props.task.checked ? 'checked' : '';

    return (
      <li className={taskClassName}>
        <button className="delte" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
          />

        <span className="text">{this.props.task.text}</span>
      </li>
    );
  }
}

Task.propType = {
  //This component gets the task to display through a React prop.
  //We can use propTypes to indicate it is required
  task: PropTypes.object.isRequired
};
