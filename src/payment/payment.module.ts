import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PaymentAccount,
  PaymentTransaction,
  TransactionDetails,
} from './entities/payment.entities';
import { UserModule } from 'src/user/user.module';
import { PaymentService } from './services/payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentAccount,
      PaymentTransaction,
      TransactionDetails,
    ]),
    UserModule,
  ],
  providers: [PaymentService],
  // exports: []
})
export class PaymentModule {}
