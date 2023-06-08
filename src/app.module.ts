import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { password } from '../ormconfig.json';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WarehouseModule } from './warehouse/warehouse.module';
import { Warehouse } from './warehouse/entities/warehouse.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password,
      database: 'mkhzan',
      entities: [User, Warehouse],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    WarehouseModule,
    WarehouseModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
