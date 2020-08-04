import { Mongo } from 'meteor/mongo'

export const MessagesGroup = new Mongo.Collection('messages_group');

MessagesGroup.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
