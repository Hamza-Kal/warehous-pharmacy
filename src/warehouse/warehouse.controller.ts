import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Injectable()
@Controller('warehouse')
export class WarehouseController {
  constructor(private wareHouseService: WarehouseService) {}

  @Get()
  async getWareHouses() {
    return this.wareHouseService.getAll();
  }
  @Post()
  createWareHouse(@Body() body: any) {
    return this.wareHouseService.create(body);
  }
}
