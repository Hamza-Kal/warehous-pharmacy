import { TypeOrmModule } from '@nestjs/typeorm';

import {
  password,
  host,
  port,
  username,
  database,
} from '../../../ormconfig.json';
import { entities } from './modules';
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
