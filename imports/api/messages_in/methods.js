import { MessagesIn } from './collection';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
    'messages_in.insert': function (_mobileID, _messageIn) {
        MessagesIn.insert({ mobileID: _mobileID, messageIn: _messageIn, createdAt: new Date() });
    }
});
