import { MessagesOut } from './collection';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
    'messages_out.insert': function (_user, _nameGroup, _messageOut, _mobileID) {
        MessagesOut.insert({ user: _user, nameGroup: _nameGroup, messageOut: _messageOut, mobileID: _mobileID, createdAt: new Date() });
    }
});