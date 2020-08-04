import { Meteor } from 'meteor/meteor';
import { Devices } from './collection';

Meteor.methods({
    'devices.insert': function (_mobileID) {
        const device = Devices.findOne({ mobileID: _mobileID });
        !device && Devices.insert({ mobileID: _mobileID, createdAt: new Date() });
    },
    'devices.update': function (_mobileID) {
        Devices.update({ mobileID: _mobileID }, { $set: { updatedAt: new Date() } });
    },
});