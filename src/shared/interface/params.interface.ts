import { ParseIntPipe } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber, IsNumberString } from 'class-validator';

export class IParams {
  @IsNumberString()
  id: number;
}
