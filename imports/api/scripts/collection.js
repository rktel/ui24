import { Mongo } from 'meteor/mongo'

export const Scripts = new Mongo.Collection('scripts');

Scripts.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
