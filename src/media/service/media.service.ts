import { Injectable } from '@nestjs/common';
import { unlink } from 'fs';
import { config } from 'dotenv';

import { imageSize } from 'image-size';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from '../entities/media.entity';
import { Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { he } from '@faker-js/faker';
config();

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
  ) {}

  constructUrlForFile(fileName: string) {
    const origin = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`;
    const url = new URL(origin);
    url.port = String(process.env.PORT);
    url.pathname = `${process.env.MEDIA_FOLDER}/${fileName}`;
    return url.toString();
  }

  async uploadImage(file: Express.Multer.File, user: IUser) {
    const url = this.constructUrlForFile(file.filename);
    const { size, path } = file;
    const { width, height } = imageSize(path);
    const image = this.mediaRepository.create({
      height,
      width,
      size,
      url,
      path,
      user: {
        id: user.id,
      },
    });
    return this.mediaRepository.save(image);
  }
  async removeImage(path: string) {
    unlink(path, (err) => {
      if (err) console.log(err);
      console.log('image removed');
    });
    return;
  }
}
