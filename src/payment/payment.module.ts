import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PaymentTransaction,
  TransactionDetails,
} from './entities/payment.entities';
import { UserModule } from 'src/user/user.module';
import { PaymentService } from './services/payment.service';
import { PaymentError } from './services/payment-error.service';
import { PaymentController } from './api/controllers/payment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentTransaction, TransactionDetails]),
    UserModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentError],
  exports: [PaymentService],
})
export class PaymentModule {}
