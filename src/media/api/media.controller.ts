import {
  Body,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { MediaService } from '../service/media.service';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';

@AuthenticatedController({
  controller: '/upload',
})
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /[\/.](jpeg|png|jpg)$/i,
        })
        .addMaxSizeValidator({
          maxSize: 1000 * 1000 * 3,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @CurrUser() user: IUser,
  ) {
    console.log(file);
    return this.mediaService.uploadImage(file, user);
  }
  @Post('/remove')
  removeImage(@Body() body: { path: string }) {
    return this.mediaService.removeImage(body.path);
  }
}
