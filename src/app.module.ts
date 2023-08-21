import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Modules } from './shared/modules/modules';
import { ConfigModule } from '@nestjs/config';
import TypeOrmModule from './shared/modules/connection.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ComplaintModule } from './complaint/complaint.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '/../../'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...TypeOrmModule,
    ...Modules,
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
