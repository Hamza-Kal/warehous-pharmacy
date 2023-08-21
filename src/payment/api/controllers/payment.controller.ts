import { Body, Param, Query } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { IParams } from 'src/shared/interface/params.interface';
import { IUser } from 'src/shared/interface/user.interface';
import { User } from 'src/user/entities/user.entity';
import { MakePaymentDto } from '../dto/make-payment.dto';
import { PaymentService } from 'src/payment/services/payment.service';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { paginationParser } from 'src/shared/pagination/pagination';

@AuthenticatedController({ controller: 'payment' })
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '/:id',
    role: [Role.PHARMACY, Role.SUPPLIER, Role.WAREHOUSE],
  })
  async makePayment(
    @CurrUser() user: IUser,
    @Body() body: MakePaymentDto,
    @Param() param: IParams,
  ) {
    await this.paymentService.verifyUser(+param.id);
    const transaction = await this.paymentService.create(+param.id, user.id);
    await this.paymentService.makePayment(transaction, body, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: 'get-me-paid/:id',
    role: [Role.PHARMACY, Role.SUPPLIER, Role.WAREHOUSE],
  })
  async getMePaid(
    @CurrUser() user: IUser,
    @Param() param: IParams,
    @Query() query: Pagination,
  ) {
    const { pagination, criteria } = paginationParser(query);
    return await this.paymentService.getMyPaidDetails(user, +param.id, {
      pagination,
      criteria,
    });
  }

  @AuthorizedApi({
    api: Api.GET,
    url: 'total-balance/:id',
    role: [Role.PHARMACY, Role.SUPPLIER, Role.WAREHOUSE],
  })
  async totalBalance(@CurrUser() user: IUser, @Param() param: IParams) {
    return await this.paymentService.getTotal(user, +param.id as number);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Role.PHARMACY, Role.SUPPLIER, Role.WAREHOUSE],
  })
  async getAllPayment(@CurrUser() user: IUser, @Query() query: Pagination) {
    const { pagination, criteria } = paginationParser(query);
    return await this.paymentService.getAllPaymentAccounts(user, {
      pagination,
      criteria,
    });
  }

  @AuthorizedApi({
    api: Api.GET,
    url: ':id',
    role: [Role.PHARMACY, Role.SUPPLIER, Role.WAREHOUSE],
  })
  async getPayment(@CurrUser() user: IUser, @Param() param: IParams) {
    return await this.paymentService.getPayment(user, +param.id as number);
  }
}
