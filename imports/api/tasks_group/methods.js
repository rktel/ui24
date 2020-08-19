import { TasksGroup } from './collection';
import { Tasks } from '../tasks/collection';
import { Scripts } from '../scripts/collection';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
    'tasks_group.insert': function (_currentUser, _nameGroup, _mobileIDArray, _nameScript) {
        const tasks_group = TasksGroup.findOne({ nameGroup: _nameGroup });
        if (!tasks_group) {
            TasksGroup.insert({ user: _currentUser, nameGroup: _nameGroup, mobileIDArray: _mobileIDArray, nameScript: _nameScript, createdAt: new Date() });
            const daScript = Scripts.findOne({ nameScript: _nameScript });

            _mobileIDArray.map(element => {
                const daTask = Tasks.findOne({ nameTask: _nameGroup, mobileID: element })
                if (!daTask) {
                    Tasks.insert({ user: _currentUser, mobileID: element, nameScript: _nameScript, nameTask: _nameGroup, script: daScript.script, createdAt: new Date() })
                }
            })

            return true
        }
        return false
    },
    'tasks_group.remove': function (_nameGroup) {
        console.log(_nameGroup);
        TasksGroup.remove({ nameGroup: _nameGroup });
        Tasks.remove({ nameTask: _nameGroup });
    },
});


