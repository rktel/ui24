import { Meteor } from 'meteor/meteor';
import { Tasks } from './collection';

// Meteor.methods({ 
//     'tasks.create': function(_currentUser, _nameGroup, _mobileID, _nameScript,_script) { 
//          const task = Tasks.findOne({nameGroup: _nameGroup, mobileID:_mobileID})
//          if(!task){
//              Tasks.insert({user:_currentUser, nameGroup:_nameGroup, mobileID: _mobileID, nameScript:_nameScript, createdAt: new Date()})
//          }
//     } 
// });

// function cleanScript(_script) {
//     console.log(_script)    
// }