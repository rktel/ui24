import { Mongo } from 'meteor/mongo';

export const Devices = new Mongo.Collection('devices');

Devices.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});