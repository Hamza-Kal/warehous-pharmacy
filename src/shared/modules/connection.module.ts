import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
import { entities } from './modules';
import dbConfig from '../../../ormconfig';
import 'dotenv/config';

=======

import dbConfig from '../../../ormconfig';
import { entities } from './modules';
const { password, host, port, username, database } = dbConfig;
>>>>>>> dev
export default [
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities,
    synchronize: true,
  }),
];
