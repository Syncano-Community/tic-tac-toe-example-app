import Syncano from 'syncano';
import Config from './Config';

const Connection = Syncano({accountKey: Config.accountKey});

export default Connection;
