import { Mongo } from 'meteor/mongo';

export const MessagesIn = new Mongo.Collection('messages_in');
MessagesIn.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    }
});
