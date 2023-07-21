import { ParseIntPipe } from '@nestjs/common';
import { IsNumber, IsNumberString } from 'class-validator';

export class IParams {
  id: number;
}
