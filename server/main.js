import { Meteor } from "meteor/meteor";
import '../imports/api/users/methods';
import './core/publish';
import '../imports/api/devices/publish';
import '../imports/api/messages_group/methods';
import '../imports/api/messages_group/publish';
// import '../imports/api/messages_out/methods';
import './core/streamers';
import { serverTCP } from './tcp'
import { createServer } from 'net';

Meteor.startup(() => {
  // Code to run on server startup.
  console.log(`Greetings from ${module.id}!`);
  serverTCP(createServer, 7100);
  Meteor.call('users.setAdmin');
});

