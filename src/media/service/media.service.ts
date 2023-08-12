import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { unlink } from 'fs';
import { config } from 'dotenv';

import { imageSize } from 'image-size';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from '../entities/media.entity';
import { Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';

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
    let image: Media | Promise<Media> = this.mediaRepository.create({
      height,
      width,
      size,
      url,
      path,
      user: {
        id: user.id,
      },
    });
    image = await this.mediaRepository.save(image);
    return {
      data: {
        id: image.id,
      },
    };
  }
  async removeImage(imageId: number) {
    const image = await this.mediaRepository.findOne({
      where: {
        id: imageId,
      },
    });
    if (!image) throw new NotFoundException('the image does not exist');
    const error = new InternalServerErrorException(
      'the image is not found on the server',
    );
    let errorHappened = false;
    unlink(image.path, (err) => {
      if (err) {
        errorHappened = true;
        throw error;
      }
    });
    if (errorHappened) throw error;

    return await this.mediaRepository.remove(image);
  }
}
