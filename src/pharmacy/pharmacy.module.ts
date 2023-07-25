import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PharmacyWebService } from './services/pharmacy-web.service';
import { PharmacyWebController } from './api/controller/pharmacy-web.controller';
import { Pharmacy } from './entities/pharmacy.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Pharmacy]), UserModule],
  controllers: [PharmacyWebController],
  providers: [PharmacyWebService],
})
export class PharmacyModule {}
