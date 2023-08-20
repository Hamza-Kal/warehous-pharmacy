import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaymentClaim,
  PaymentClaimDetails,
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
import { de } from '@faker-js/faker';
import { IUser } from 'src/shared/interface/user.interface';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentTransaction)
    private transactionRepository: Repository<PaymentTransaction>,
    @InjectRepository(TransactionDetails)
    private readonly transactionDetails: Repository<TransactionDetails>,
    @InjectRepository(PaymentClaim)
    private readonly claimRepository: Repository<PaymentClaim>,
    @InjectRepository(PaymentClaimDetails)
    private readonly claimDetailsRepository: Repository<PaymentClaimDetails>,
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

  private async createDeptAccount(
    deptId: number | User,
    receiverId: number | User,
  ) {
    let deptAccount = await this.claimRepository.findOne({
      where: {
        debtor: {
          id: deptId as number,
        },
        receiver: {
          id: receiverId as number,
        },
      },
    });
    if (deptAccount) return deptAccount;

    deptAccount = new PaymentClaim();
    deptAccount.debtor = deptId as User;
    deptAccount.receiver = receiverId as User;
    await this.claimRepository.save(deptAccount);
    return deptAccount;
  }

  private async addDept(deptAccount: PaymentClaim, amount: number) {
    if (amount < 0) return;

    deptAccount.amount += amount;

    await this.claimRepository.save(deptAccount);
    const deptDetails = new PaymentClaimDetails();
    deptDetails.claim = deptAccount;
    deptDetails.amount = amount;
    await this.claimDetailsRepository.save(deptDetails);
  }

  async createDept(
    deptId: number | User,
    receiverId: number | User,
    amount: number,
  ) {
    await this.verifyUser(deptId as number);
    await this.verifyUser(receiverId as number);

    const deptAccount = await this.createDeptAccount(deptId, receiverId);
    await this.addDept(deptAccount, amount);
  }

  async getDept(actor: IUser, userId: number) {
    const fromActorToUser = await this.claimRepository.findOne({
      where: {
        debtor: {
          id: actor.id,
        },
        receiver: {
          id: userId,
        },
      },
    });

    const fromUserToActor = await this.claimRepository.findOne({
      where: {
        receiver: {
          id: actor.id,
        },
        debtor: {
          id: userId,
        },
      },
    });

    if (!fromActorToUser && !fromUserToActor) {
      this.paymentError.notFoundTransaction();
    }

    
  }
}
