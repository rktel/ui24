import { Meteor } from 'meteor/meteor';
import { MessagesGroup } from './collection';

Meteor.publish('messages_group', function (_currentUser) {
    if (this.userId) {
        return MessagesGroup.find({ user: _currentUser })
    } else {
        return []
    }
});
