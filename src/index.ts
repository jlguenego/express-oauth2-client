import './modules';
import {OAuth2Client} from './OAuth2Client';
import {envOptions} from './options';

export const oauth2Client = new OAuth2Client(envOptions);
