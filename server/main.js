import { Meteor } from "meteor/meteor";
import '../imports/api/users/methods';
import './core/publish';
// HOME
import '../imports/api/devices/publish';
//MESSAGESLIST
// import '../imports/api/messages_group/methods';
import '../imports/api/messages_group/publish';
//TASKSLIST
// import '../imports/api/tasks_group/methods';
import '../imports/api/tasks_group/publish';
import '../imports/api/tasks_group/methods';
//SCRIPTS
import '../imports/api/scripts/methods';
import '../imports/api/scripts/publish';
// TASKS
import '../imports/api/tasks/publish';

// STREAM SERVER
import {serverToast} from '../imports/streamers/serverToast'

import './core/streamers';
import { serverTCP } from './tcp'
import { createServer } from 'net';

Meteor.startup(() => {
  // Code to run on server startup.
  console.log(`Greetings from ${module.id}!`);
  serverTCP(createServer, 7100);
  Meteor.call('users.setAdmin');
  // setInterval(()=>{
  //   console.log('settimeout message');
  //    serverToast.emit('toast');
  // },3000)
});

