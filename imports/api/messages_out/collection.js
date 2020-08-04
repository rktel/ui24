import { Mongo } from 'meteor/mongo';

export const MessagesOut = new Mongo.Collection('messages_out');
MessagesOut.deny({
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
