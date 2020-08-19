import { Scripts } from './collection'
import { Meteor } from 'meteor/meteor'

Meteor.methods({
    'scripts.create': function (_name, _script, _user) {
        const daScript = Scripts.findOne({ nameScript: _name })
        if (!daScript) {
            let script = _script.split('\r\n')
            script = script.filter(element => {
                return element[0] === '>' && !element.includes('>SRT;') && !element.includes('>SXADP0')
            })
            if (script.length) {
                script = script.map((element, index) => {
                    return {
                        index: index + 1,
                        message: element,
                        responseInclude: getResponse(element),
                        state: 0
                    }
                })
                Scripts.insert({
                    nameScript: _name,
                    author: _user,
                    createdAt: new Date(),
                    script: script
                })
            }
        }
    },
    'scripts.remove': function (_name) {
        Scripts.remove({ nameScript: _name });
    }
});


function getResponse(_message) {
   return _message.slice(2, _message.indexOf('<'));
   // return '>R' + _message.slice(2, _message.indexOf('<'));
}