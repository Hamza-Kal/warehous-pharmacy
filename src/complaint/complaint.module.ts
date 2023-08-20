import { Module } from '@nestjs/common';
import { ComplaintService } from './services/complaint.service';
import { ComplaintController } from './api/complaint.controller';

@Module({
  providers: [ComplaintService],
  controllers: [ComplaintController],
})
export class ComplaintModule {}
