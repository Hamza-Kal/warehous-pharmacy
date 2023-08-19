import { Body, Param } from '@nestjs/common';
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

@AuthenticatedController({ controller: 'payment' })
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Role.PHARMACY, Role.SUPPLIER, Role.WAREHOUSE],
  })
  async makePayment(
    @CurrUser() user: IUser,
    @Body() body: MakePaymentDto,
    @Param() param: IParams,
  ) {
    const transaction = await this.paymentService.create(+param.id, user.id);
    await this.paymentService.makePayment(transaction, body);
  }
}
