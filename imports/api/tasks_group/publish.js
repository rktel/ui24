import { Meteor } from 'meteor/meteor';
import { TasksGroup } from './collection';

Meteor.publish('tasks_group', function (_currentUser) {
    if (this.userId) {
        return TasksGroup.find({ user: _currentUser })
    } else {
        return []
    }
});