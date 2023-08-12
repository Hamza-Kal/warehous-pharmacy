import { Module } from '@nestjs/common';
import { MediaController } from './api/media.controller';
import { MediaService } from './service/media.service';
import { MulterModule } from '@nestjs/platform-express';
import { storage } from './utils/multer.util';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { Media } from './entities/media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Media]),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage,
      }),
    }),
    UserModule,
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
