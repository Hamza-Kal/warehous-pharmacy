import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './modules';
import dbConfig from '../../../ormconfig';
import 'dotenv/config';

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
