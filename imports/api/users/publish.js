import { Meteor } from 'meteor/meteor';

Meteor.publish('daUsers', function () {
    if (this.userId) {
        return Meteor.users.find({})
    } else {
        return []
    }
});