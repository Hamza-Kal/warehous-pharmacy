import {
  Body,
  HttpStatus,
  Param,
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
import { IParams } from 'src/shared/interface/params.interface';

@AuthenticatedController({
  controller: '/upload',
})
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('/remove/:id')
  removeImage(@Param() param: IParams) {
    return this.mediaService.removeImage(+param.id);
  }

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
}
