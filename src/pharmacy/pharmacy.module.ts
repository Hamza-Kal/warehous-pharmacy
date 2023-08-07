import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PharmacyWebService } from './services/pharmacy-web.service';
import { PharmacyWebController } from './api/controller/pharmacy-web.controller';
import { Pharmacy } from './entities/pharmacy.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacyService } from './services/pharmacy.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pharmacy]), UserModule],
  controllers: [PharmacyWebController],
  providers: [PharmacyWebService, PharmacyService],
  exports: [PharmacyService],
})
export class PharmacyModule {}
