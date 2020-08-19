import { Mongo } from 'meteor/mongo'

export const Tasks = new Mongo.Collection('tasks');

Tasks.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
