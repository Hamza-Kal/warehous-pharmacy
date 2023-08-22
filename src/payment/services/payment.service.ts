import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaymentTransaction,
  TransactionDetails,
  TransactionStatus,
} from '../entities/payment.entities';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { MakePaymentDto } from '../api/dto/make-payment.dto';
import { UserError } from 'src/user/services/user-error.service';
import { UserService } from 'src/user/services/user.service';
import { Role } from 'src/shared/enums/roles';
import { PaymentError } from './payment-error.service';
import { de, fi, tr } from '@faker-js/faker';
import { IUser } from 'src/shared/interface/user.interface';
import { GetPayment } from '../api/dto/response/get-dept-for-user.dto';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { GetByCriteriaMyPaidDetails } from '../api/dto/response/get-by-id-my-paid-details.dto';
import { send } from 'process';
import { GetByCriteriaMyPaid } from '../api/dto/response/get-by-criteria.dto';
import { IParams } from 'src/shared/interface/params.interface';
import { GetByCriteriaToPaidDetails } from '../api/dto/response/get-all.paidTo-details.dto';
import { PaymentRole } from '../api/dto/request/find-all.dto';

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

  async create(sender: number | User, receiver: number | User) {
    if (sender === receiver) this.userError.notFoundUser();
    let firstUser = sender,
      secondUser = receiver;
    if (firstUser > secondUser) {
      [firstUser, secondUser] = [secondUser, firstUser];
    }

    let paymentAccount = await this.transactionRepository.findOne({
      where: {
        firstUser: {
          id: firstUser as number,
        },
        secondUser: {
          id: secondUser as number,
        },
      },
      relations: {
        firstUser: true,
      },
      select: {
        id: true,
        payment: true,
        debt: true,
        total: true,
        firstUser: {
          id: true,
        },
      },
    });
    if (paymentAccount) return paymentAccount;
    paymentAccount = new PaymentTransaction();
    paymentAccount.firstUser = firstUser as User;
    paymentAccount.secondUser = secondUser as User;
    await this.transactionRepository.save(paymentAccount);
    return paymentAccount;
  }

  async makePayment(
    transaction: PaymentTransaction,
    body: MakePaymentDto,
    user: IUser,
  ) {
    const { date, amount } = body;
    const paymentAmount =
      transaction.firstUser.id === user.id ? amount : amount * -1;

    const payment = new TransactionDetails();
    payment.amount = paymentAmount;
    payment.transaction = transaction;
    payment.date = date;
    transaction.total += paymentAmount;
    transaction.payment += paymentAmount;
    await this.transactionRepository.save(transaction);
    await this.transactionDetails.save(payment);
  }

  //debt and payment

  async getDept(actor: IUser, userId: number | User) {
    let firstId: User | number = actor.id;
    let secondId: User | number = userId as number;

    if (firstId > secondId) {
      [firstId, secondId] = [secondId, firstId];
    }
    const transaction = await this.transactionRepository.findOne({
      where: {
        firstUser: {
          id: actor.id as number,
        },
        secondUser: {
          id: userId as number,
        },
      },
      relations: {
        firstUser: true,
        secondUser: true,
      },
      select: {
        id: true,
        debt: true,
        firstUser: {
          id: true,
        },
        secondUser: {
          id: true,
        },
      },
    });

    if (!transaction) return 0;

    const amount =
      transaction?.firstUser.id === firstId
        ? transaction.debt
        : transaction.debt * -1;

    return amount;
  }

  async getAllPaymentAccounts(
    user: IUser,
    {
      pagination,
      criteria,
    }: {
      pagination: Pagination;
      criteria: { role: PaymentRole | Role };
    },
  ) {
    const query = { role: criteria.role as Role };

    const { limit, skip } = pagination;
    const totalRecords = await this.transactionRepository.count({
      where: [
        {
          firstUser: {
            id: user.id,
          },
          secondUser: {
            ...query,
          },
          total: Not(0),
        },
        {
          firstUser: {
            ...query,
          },
          secondUser: {
            id: user.id,
          },
          total: Not(0),
        },
      ],
    });
    const payments = await this.transactionRepository.find({
      where: [
        {
          firstUser: {
            id: user.id,
          },
          secondUser: {
            ...query,
          },
          total: Not(0),
        },
        {
          secondUser: {
            id: user.id,
          },
          firstUser: {
            ...query,
          },
          total: Not(0),
        },
      ],
      select: {
        id: true,
        debt: true,

        payment: true,
        total: true,
        firstUser: {
          id: true,
          warehouse: {
            name: true,
          },
          pharmacy: {
            name: true,
          },
          supplier: {
            name: true,
          },
        },
        secondUser: {
          id: true,
          warehouse: {
            name: true,
          },
          pharmacy: {
            name: true,
          },
          supplier: {
            name: true,
          },
        },
      },
      relations: {
        firstUser: {
          warehouse: true,
          pharmacy: true,
          supplier: true,
        },
        secondUser: {
          warehouse: true,
          pharmacy: true,
          supplier: true,
        },
      },
      skip,
      take: limit,
    });

    return {
      totalRecords,
      data: payments.map(
        (payment) => new GetByCriteriaMyPaid({ payment, userId: user.id }),
      ),
    };
  }

  async getMyPaymentDetails(
    user: IUser,
    { id }: IParams,
    { pagination, criteria }: { pagination: Pagination; criteria: any },
  ) {
    const { limit, skip } = pagination;
    const totalRecords = await this.transactionDetails.count({
      where: [
        {
          status: TransactionStatus.paid,
          amount: MoreThan(0),
          transaction: {
            id,
            firstUser: {
              id: user.id,
            },
            total: Not(0),
          },
        },
        {
          status: TransactionStatus.paid,
          amount: LessThan(0),
          transaction: {
            id,
            secondUser: {
              id: user.id,
            },
            total: Not(0),
          },
        },
      ],
    });
    const payments = await this.transactionDetails.find({
      where: [
        {
          status: TransactionStatus.paid,
          amount: MoreThan(0),
          transaction: {
            id,
            firstUser: {
              id: user.id,
            },
            total: Not(0),
          },
        },
        {
          status: TransactionStatus.paid,
          amount: LessThan(0),
          transaction: {
            id,
            secondUser: {
              id: user.id,
            },
            total: Not(0),
          },
        },
      ],
      select: {
        id: true,
        amount: true,
        date: true,
        transaction: {
          firstUser: {
            id: true,
            warehouse: {
              name: true,
            },
            pharmacy: {
              name: true,
            },
            supplier: {
              name: true,
            },
          },

          secondUser: {
            id: true,
            warehouse: {
              name: true,
            },
            pharmacy: {
              name: true,
            },
            supplier: {
              name: true,
            },
          },
        },
      },
      relations: {
        transaction: {
          firstUser: {
            warehouse: true,
            pharmacy: true,
            supplier: true,
          },
          secondUser: {
            warehouse: true,
            pharmacy: true,
            supplier: true,
          },
        },
      },
      skip,
      take: limit,
    });

    return {
      totalRecords,
      data: payments.map((detail) =>
        new GetByCriteriaToPaidDetails({ detail }).toObject(),
      ),
    };
  }

  async GetUserPaymentDetails(
    user: IUser,
    { id }: IParams,
    { pagination, criteria }: { pagination: Pagination; criteria: any },
  ) {
    const { limit, skip } = pagination;
    const totalRecords = await this.transactionDetails.count({
      where: [
        {
          status: TransactionStatus.paid,
          amount: LessThan(0),
          transaction: {
            id,
            firstUser: {
              id: user.id,
            },
            total: Not(0),
          },
        },
        {
          status: TransactionStatus.paid,
          amount: MoreThan(0),
          transaction: {
            id,
            secondUser: {
              id: user.id,
            },
            total: Not(0),
          },
        },
      ],
    });
    const payments = await this.transactionDetails.find({
      where: [
        {
          status: TransactionStatus.paid,
          amount: LessThan(0),
          transaction: {
            id,
            firstUser: {
              id: user.id,
            },
            total: Not(0),
          },
        },
        {
          status: TransactionStatus.paid,
          amount: MoreThan(0),
          transaction: {
            id,
            secondUser: {
              id: user.id,
            },
            total: Not(0),
          },
        },
      ],
      select: {
        id: true,
        date: true,
        amount: true,
        transaction: {
          firstUser: {
            id: true,
            warehouse: {
              name: true,
            },
            pharmacy: {
              name: true,
            },
            supplier: {
              name: true,
            },
          },

          secondUser: {
            id: true,
            warehouse: {
              name: true,
            },
            pharmacy: {
              name: true,
            },
            supplier: {
              name: true,
            },
          },
        },
      },
      relations: {
        transaction: {
          firstUser: {
            warehouse: true,
            pharmacy: true,
            supplier: true,
          },
          secondUser: {
            warehouse: true,
            pharmacy: true,
            supplier: true,
          },
        },
      },
      skip,
      take: limit,
    });

    return {
      totalRecords,
      data: payments.map((detail) =>
        new GetByCriteriaToPaidDetails({ detail }).toObject(),
      ),
    };
  }

  async getPaid(actor: IUser, userId: number) {
    let firstId: User | number = actor.id;
    let secondId: User | number = userId as number;

    if (firstId > secondId) {
      [firstId, secondId] = [secondId, firstId];
    }
    const transaction = await this.transactionRepository.findOne({
      where: {
        firstUser: {
          id: firstId as number,
        },
        secondUser: {
          id: secondId as number,
        },
      },
      select: {
        id: true,
        payment: true,
        firstUser: {
          id: true,
        },
        secondUser: {
          id: true,
        },
      },
      relations: {
        firstUser: true,
        secondUser: true,
      },
    });

    if (!transaction) {
      return 0;
    }

    const amount =
      transaction?.firstUser.id === firstId
        ? transaction.payment
        : transaction.payment * -1;

    return amount;
  }

  async getMyPaidDetails(
    actor: IUser,
    userId: number,
    { criteria, pagination }: { criteria: any; pagination: Pagination },
  ) {
    let firstId: User | number = actor.id;
    let secondId: User | number = userId as number;

    if (firstId > secondId) {
      [firstId, secondId] = [secondId, firstId];
    }
    const { limit, skip } = pagination;
    const transaction = await this.transactionRepository.findOne({
      where: {
        firstUser: {
          id: firstId,
        },
        secondUser: {
          id: secondId,
        },
      },
    });

    if (!transaction) {
      this.paymentError.notFoundTransaction();
    }

    const totalRecords = await this.transactionDetails.count({
      where: {
        transaction: {
          id: transaction.id,
        },
        amount: MoreThan(0),
      },
    });

    const details = await this.transactionDetails.find({
      where: {
        transaction: {
          id: transaction.id,
        },
        amount: MoreThan(0),
      },

      skip,
      take: limit,
    });

    return {
      totalRecords,
      data: details.map((detail) =>
        new GetByCriteriaMyPaidDetails({ detail }).toObject(),
      ),
    };
  }

  private async addDept(
    transaction: PaymentTransaction,
    amount: number,
    userId: number,
  ) {
    const transactionAmount =
      transaction.firstUser.id === userId ? amount : amount * -1;
    transaction.debt += transactionAmount;
    transaction.total -= transactionAmount;

    await this.transactionRepository.save(transaction);
    const deptDetails = new TransactionDetails();
    deptDetails.amount = transactionAmount;
    deptDetails.status = TransactionStatus.debt;
    await this.transactionDetails.save(deptDetails);
  }

  async createDept(firstUser: number, secondUser: number, amount: number) {
    const transaction = await this.create(firstUser, secondUser);
    await this.addDept(transaction, amount, firstUser);
  }

  async verifyUser(sender: number) {
    const user = await this.userService.findUser(sender);
    if (![Role.WAREHOUSE, Role.SUPPLIER, Role.PHARMACY].includes(user.role)) {
      this.paymentError.notAllowedToMakePayment();
    }
    return user;
  }
}
