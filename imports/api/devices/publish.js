import { Meteor } from 'meteor/meteor';
import { Devices } from './collection';

Meteor.publish('devices', function () {
    if (this.userId) {
        return Devices.find({})
    } else {
        return []
    }
});