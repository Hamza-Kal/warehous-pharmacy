import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Modules } from './shared/modules/modules';
import { ConfigModule } from '@nestjs/config';
import TypeOrmModule from './shared/modules/connection.module';

@Module({
  imports: [ConfigModule.forRoot(), ...TypeOrmModule, ...Modules],
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
