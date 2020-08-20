import { streamClient } from '../../imports/streamers/client';
//import { serverToast } from '../../imports/streamers/serverToast';

import '../../imports/api/devices/methods';
import '../../imports/api/messages_in/methods';
import '../../imports/api/messages_out/methods';
import '../../imports/api/messages_group/methods';

import { Meteor } from 'meteor/meteor';
import { Tasks } from '../../imports/api/tasks/collection';
import { differenceInMinutes } from 'date-fns'

export function serverTCP(_serverInstance, _portServer, _hostServer = '0.0.0.0') {
    // CONSTANTS
    const SOCKET_TIMEOUT = 1000 * 60 * 10;
    const SOCKET_KEEPALIVE = 1000 * 10;
    const server = _serverInstance();

      // test stream task
    //   serverToast.on('toast', () => {
    //     console.log('======> toast from server');
    // })

    server.listen(_portServer, _hostServer, () => console.log('Server TCP ready!'));
    server.on('close', () => console.log('Server TCP close!'));
    server.on('error', serverError => {
        if (serverError.code == 'EADDRINUSE') {
            console.log('Address in use, retrying...')
            setTimeout(() => {
                server.close();
                server.listen(_portServer, _hostServer);
            }, 5000);
        }
    });
    server.on('connection', Meteor.bindEnvironment(socketConnected => {
        // Setting Socket
        socketConnected.setKeepAlive(true, SOCKET_KEEPALIVE);
        socketConnected.setTimeout(SOCKET_TIMEOUT);
        // Check Task
        const intervalInstance = Meteor.setInterval(()=>{
            if (!socketConnected.destroyed && socketConnected.mobileID) {
                const daTask = Tasks.findOne({mobileID: socketConnected.mobileID})
                if(daTask){
                    const now = new Date();
                    const diffenceMinutes = differenceInMinutes(now, daTask.createdAt);
                    if(diffenceMinutes<61){
                        const daScript = daTask.script;
                        const daMessageStateOld = daScript.find(element => element.state === 0);
                        if(daMessageStateOld){
                            socketConnected.write(daMessageStateOld.message, Meteor.bindEnvironment(()=>{
                                Tasks.update({mobileID: socketConnected.mobileID, 'script.state': 0},{$set:{'script.$.state': 1}})
                            }))
                        }
                        const daMessageStateOne = daScript.find(element => element.state === 1);
                        if(daMessageStateOne){
                            socketConnected.write(daMessageStateOne.message, Meteor.bindEnvironment(()=>{
                               // Tasks.update({mobileID: socketConnected.mobileID, 'script.state': 0},{$set:{'script.$.state': 1}})
                            }))
                        }
                        const allStateTwo = daScript.filter(element => element.state === 2)
                        const lengthStateTwo = allStateTwo.length
                        const percent = lengthStateTwo === 0 ? 0 : parseInt(100*lengthStateTwo / daScript.length)

                        Tasks.update({mobileID: socketConnected.mobileID},{$set:{percent: percent, meter: lengthStateTwo}})
                        if(percent === 100){
                           const tasksEnd = Tasks.findOne( { mobileID: socketConnected.mobileID, endedAt: { $exists: true } } )
                           if(!tasksEnd){
                            Tasks.update({mobileID: socketConnected.mobileID},{$set:{endedAt: new Date()}})
                           }
                               // 
                            
                            // Meteor.clearInterval(intervalInstance);
                        }
                        // let total = 0;
                        //     daScript.map(element => total = total + element.state)
                        // if(2*daScript.length === total){
                        //     Eh Fin
                        // }

                        // if(!daMessageStateOld && !daMessageStateOne){
                        //     Eh Fin
                        // }

                    }else{
                        // clearInterval(intervalInstance);
                    }
              
                }
                // const writeMessageSuccess = socketConnected.write(_messageOut, Meteor.bindEnvironment(() => {
                //     console.log(socketConnected.mobileID, 'comando ', _messageOut, 'enviado!');
              
                // }))
                // if (!writeMessageSuccess) {
                //     console.log('Error Flush data command:', socketConnected.mobileID)
                // }
            }
        }, 2500)
        // From Client message to mobileID (device)
        streamClient.on('writeMessage', (_user, _nameGroup, _messageOut, _mobileID) => {
            if (!socketConnected.destroyed && socketConnected.mobileID === _mobileID) {
                const writeMessageSuccess = socketConnected.write(_messageOut, Meteor.bindEnvironment(() => {
                    console.log(socketConnected.mobileID, 'comando ', _messageOut, 'enviado!');
                    Meteor.call('messages_out.insert', _user, _nameGroup, _messageOut, _mobileID);
                    Meteor.call('messages_groupOut.update', _nameGroup, _user, _messageOut, _mobileID);
                }))
                if (!writeMessageSuccess) {
                    console.log('Error Flush data command:', socketConnected.mobileID)
                }
            }
        })
        socketConnected.on('data', Meteor.bindEnvironment(rawData => {
            // console.log(rawData.toString());
            const { mobileID } = parseData(rawData)
            if (mobileID) {
                sendStrike(socketConnected, mobileID);

                if (!socketConnected['mobileID']) { // is first time?
                    socketConnected.mobileID = mobileID;
                    Meteor.call('devices.insert', mobileID);
                } else {
                    Meteor.call('devices.update', mobileID);
                }
            }
        }))
        socketConnected.on('timeout', () => {
            console.log('timeout:',socketConnected.mobileID);
            socketConnected.destroy();
        });
        socketConnected.on('close', (closeError) => { 
            console.log('close:',socketConnected.mobileID);
        });
        socketConnected.on('error', () => { 
            console.log('error:',socketConnected.mobileID);
        });
        socketConnected.on('end', () => { 
            console.log('end:',socketConnected.mobileID);
        });

    }))

}

// HELP FUNCTIONS
function parseData(data) {
    let unit = data.toString()

    if (unit.includes('ID=')) {
        unit = unit.split('\r\n')[0]
        unit = unit.split(';')[unit.split(';').length - 1]
        unit = unit.includes('ID=') && unit.slice(unit.indexOf('ID=') + 3, unit.lastIndexOf('<'))

        if (unit) {
            if (data.toString().includes('>REV') || data.toString().includes('>RET')) {
                // EVENT REPORT
            }
            else if(data.toString()[0] === '>' && data.toString()[1] === 'R') {
                // RESPONSES [MessagesIn]
                console.log(data.toString());
                const daTask = Tasks.findOne({mobileID: unit})
                if(daTask){
                    const daScript = daTask.script;
                    const daMessage = daScript.find(element => data.toString().includes(element.responseInclude))
                    if(daMessage){
                        const daIndex = daMessage.index;
                        Tasks.update({mobileID: unit, 'script.index': daIndex},{$set:{'script.$.state': 2, 'script.$.response': data.toString()}})
                    }
                }

                Meteor.call('messages_in.insert', unit, data.toString());
                Meteor.call('messages_groupIn.update', unit, data.toString());
            }
        }
        return {
            mobileID: unit
        }
    }
    return false
}
function sendStrike(sock, message) {
    for (let index = 0; index < 10; index++) {
        sock.write(message)
    }
}