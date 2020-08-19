import { Meteor } from 'meteor/meteor';
import { Scripts } from './collection';

Meteor.publish('scripts', function () {
    if (this.userId) {
        return Scripts.find({})
    } else {
        return []
    }
});