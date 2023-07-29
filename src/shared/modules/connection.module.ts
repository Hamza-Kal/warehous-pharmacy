import { TypeOrmModule } from '@nestjs/typeorm';

import dbConfig from '../../../ormconfig';
import { entities } from './modules';
const { password, host, port, username, database } = dbConfig;
export default [
  TypeOrmModule.forRoot({
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
    entities,
    synchronize: true,
  }),
];
