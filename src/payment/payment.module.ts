import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PaymentAccount,
  PaymentClaim,
  PaymentClaimDetails,
  PaymentTransaction,
  TransactionDetails,
} from './entities/payment.entities';
import { UserModule } from 'src/user/user.module';
import { PaymentService } from './services/payment.service';
import { PaymentError } from './services/payment-error.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentAccount,
      PaymentTransaction,
      TransactionDetails,
      PaymentClaim,
      PaymentClaimDetails,
    ]),
    UserModule,
  ],
  providers: [PaymentService, PaymentError],
  exports: [PaymentService],
})
export class PaymentModule {}
