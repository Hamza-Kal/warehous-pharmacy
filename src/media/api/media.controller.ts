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
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Role } from 'src/shared/enums/roles';

@AuthenticatedController({
  controller: '/uploads',
})
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @AuthorizedApi({
    api: Api.DELETE,
    role: [Role.SUPPLIER, Role.ADMIN],
    url: '/remove',
  })
  removeImage(@Body() body: { imageId: number }) {
    return this.mediaService.removeImage(body.imageId);
  }

  @AuthorizedApi({
    api: Api.POST,
    role: [Role.SUPPLIER, Role.ADMIN],
    url: '',
  })
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
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
    return this.mediaService.uploadImage(file, user);
  }
}
