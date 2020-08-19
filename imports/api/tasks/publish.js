import { Meteor } from 'meteor/meteor';
import { Tasks } from './collection';

Meteor.publish('tasks', function (_currentUser, _nameTask) {
    if (this.userId) {
        return Tasks.find({ user: _currentUser, nameTask: _nameTask })
    } else {
        return []
    }
});