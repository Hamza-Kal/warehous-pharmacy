import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaymentTransaction,
  TransactionDetails,
} from '../entities/payment.entities';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { MakePaymentDto } from '../api/dto/make-payment.dto';
import { UserError } from 'src/user/services/user-error.service';
import { UserService } from 'src/user/services/user.service';
import { Role } from 'src/shared/enums/roles';
import { PaymentError } from './payment-error.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentTransaction)
    private transactionRepository: Repository<PaymentTransaction>,
    @InjectRepository(TransactionDetails)
    private readonly transactionDetails: Repository<TransactionDetails>,
    private readonly userError: UserError,
    private readonly paymentError: PaymentError,
    private readonly userService: UserService,
  ) {}

  async verifyUser(sender: number) {
    const user = await this.userService.findUser(sender);
    if (![Role.WAREHOUSE, Role.SUPPLIER, Role.PHARMACY].includes(user.role)) {
      this.paymentError.notAllowedToMakePayment();
    }
    return user;
  }

  async create(sender: number | User, receiver: number | User) {
    if (sender === receiver) this.userError.notFoundUser();

    let paymentAccount = await this.transactionRepository.findOne({
      where: {
        sender: {
          id: sender as number,
        },
        receiver: {
          id: receiver as number,
        },
      },
    });
    if (paymentAccount) return paymentAccount;
    paymentAccount = new PaymentTransaction();
    paymentAccount.sender = sender as User;
    paymentAccount.receiver = receiver as User;
    await this.transactionRepository.save(paymentAccount);
    return paymentAccount;
  }

  async makePayment(transaction: PaymentTransaction, body: MakePaymentDto) {
    const { date, amount } = body;
    const payment = new TransactionDetails();
    payment.amount = amount;
    payment.transaction = transaction;
    payment.date = date;
    await this.transactionDetails.save(payment);
  }
}
