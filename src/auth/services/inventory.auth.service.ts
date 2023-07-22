import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import { InventroyRegister } from '../api/dto/register.dto';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { Role } from 'src/shared/enums/roles';
import { WarehouseService } from 'src/warehouse/services/warehouse.service';
import { InventoryService } from 'src/inventory/services/inventory.service';

@Injectable()
export class InventoryAuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService,
  ) {}

  async register(body: InventroyRegister, { id }: IUser) {
    const { name, inventoryPhoneNumber, location, ...inventoryAccount } = body;

    //START TRANSACTION
    inventoryAccount.completedAccount = true;
    console.log(inventoryAccount);
    const user = await this.userService.createOne(inventoryAccount);
    const warehouse = await this.warehouseService.findByUser(id);
    const inventory = await this.inventoryService.create(
      { name, phoneNumber: inventoryPhoneNumber, location, manager: user },
      warehouse,
    );
    console.log('inventory', inventory);
    return { id: inventory.id };
  }
}
