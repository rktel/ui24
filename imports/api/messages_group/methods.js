import { MessagesGroup } from './collection';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
    'messages_group.insert': function (_currentUser, _nameGroup, _mobileIDArray) {
        const messages_group = MessagesGroup.findOne({ nameGroup: _nameGroup });
        if (!messages_group) {
            MessagesGroup.insert({ user: _currentUser, nameGroup: _nameGroup, mobileIDArray: _mobileIDArray, messages: [], createdAt: new Date() });
            return true
        }
        return false
    },
    'messages_group.remove': function (_nameGroup) {
        MessagesGroup.remove({ nameGroup: _nameGroup });
    },
    'messages_groupOut.update': function (_nameGroup, _user, _message) {
        MessagesGroup.update({ nameGroup: _nameGroup }, { $push: { messages: { responseInclude: getResponse(_message), type: 'out', id: _user, message: _message, createdAt: new Date() } } })
        MessagesGroup.update({ nameGroup: _nameGroup }, { $set: { messageOut: { responseInclude: getResponse(_message), type: 'out', id: _user, message: _message, createdAt: new Date() } } })
    },
    'messages_groupIn.update': function (_mobileID, _message) {
        const messages_group = MessagesGroup.find({ mobileIDArray: _mobileID, messageOut: { $exists: true } });
        if (messages_group) {
            messages_group.map(group => {
                const messageOut = group.messageOut;
                if (_message.includes(messageOut.responseInclude) || _message.includes('>RER')) {
                    MessagesGroup.update({ nameGroup: group.nameGroup }, { $push: { messages: { type: 'in', id: _mobileID, message: _message, createdAt: new Date() } } })
                }
            })
        }
    },
})

function getResponse(_message){
    return '>R' + _message.slice(2, _message.indexOf('<')) +';ID=';
  }
