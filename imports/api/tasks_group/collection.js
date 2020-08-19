import { Mongo } from 'meteor/mongo'

export const TasksGroup = new Mongo.Collection('tasks_group');

TasksGroup.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});