import { WarehouseAuthService } from 'src/auth/services/warehouse.auth.service';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';

@AuthenticatedController({
  controller: 'auth',
})
export class WarehouseAuthController {
  constructor(private warehouseAuthService: WarehouseAuthService) {}
}
