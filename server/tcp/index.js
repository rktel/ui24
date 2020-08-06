import { streamClient } from '../../imports/streamers/client';

import '../../imports/api/devices/methods';
import '../../imports/api/messages_in/methods';
import '../../imports/api/messages_out/methods';
import '../../imports/api/messages_group/methods'
import { Meteor } from 'meteor/meteor';

export function serverTCP(_serverInstance, _portServer, _hostServer = '0.0.0.0') {
    // CONSTANTS
    const SOCKET_TIMEOUT = 1000 * 60 * 5;
    const SOCKET_KEEPALIVE = 1000 * 10;
    const server = _serverInstance();

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
        // From Client message to mobileID (device)
        streamClient.on('writeMessage', (_user, _nameGroup, _messageOut, _mobileID) => {
            if (socketConnected.mobileID === _mobileID) {
                const writeMessageSuccess = socketConnected.write(_messageOut)
                if (writeMessageSuccess) {
                    console.log(socketConnected.mobileID, 'comando ', _messageOut, 'enviado!');
                    Meteor.call('messages_out.insert',_user, _nameGroup, _messageOut, _mobileID);
                    Meteor.call('messages_groupOut.update',_nameGroup, _user, _messageOut);
                } else {
                    console.log(socketConnected.mobileID, ' Error al enviar comando ', _messageOut)
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
        socketConnected.on('timeout', () => { });
        socketConnected.on('close', (closeError) => { });
        socketConnected.on('error', () => { });
        socketConnected.on('end', () => { });

    }))

}

// HELP FUNCTIONS
function parseData(data) {
    let unit = data.toString()

    if (unit.includes('ID=')) {
        unit = unit.split('\r\n')[0]
        unit = unit.split(';')[unit.split(';').length - 1]
        unit = unit.includes('ID=') && unit.slice(unit.indexOf('ID=') + 3, unit.lastIndexOf('<'))

        //unit.match(/^[0-9a-zA-Z]+$/) ? unit.match(/^[0-9a-zA-Z]+$/)[0] : undefined


        if (unit) {
            // console.log(unit);
            if (data.toString().includes('>REV') || data.toString().includes('>RET')) {
                // EVENT REPORT
            }
            else {
                // RESPONSES [MessagesIn]
                console.log(data.toString());
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