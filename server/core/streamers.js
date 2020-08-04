import { streamClient } from '../../imports/streamers/client'
import { serverToast } from '../../imports/streamers/serverToast'


streamClient.allowWrite('writeMessage', 'logged');

serverToast.allowRead('toast', 'logged');