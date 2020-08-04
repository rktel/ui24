import { Meteor } from 'meteor/meteor';

Meteor.publish('role', function () {
    console.log(this.userId)
    if (this.userId) {
        return Meteor.roleAssignment.find({ 'user._id': this.userId });
    } else {
        this.ready()
    }
})