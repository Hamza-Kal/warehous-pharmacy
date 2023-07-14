import { TypeOrmModule } from '@nestjs/typeorm';

import {
  password,
  host,
  port,
  username,
  database,
} from '../../../ormconfig.json';
import { Entities } from './modules';
export default [
  TypeOrmModule.forRoot({
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
    entities: Entities,
    synchronize: true,
  }),
];
