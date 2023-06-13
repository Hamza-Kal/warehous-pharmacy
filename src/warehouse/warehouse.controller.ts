import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  ParseIntPipe,
  Post,
  Patch,
} from "@nestjs/common";
import { CreateWarehouseDto } from "./dtos/create-warehouse.dto";
import { UpdateWareHouseDto } from "./dtos/update-warehouse.dto";
import { WarehouseService } from "./warehouse.service";

@Injectable()
@Controller("warehouse")
export class WarehouseController {
  constructor(private warehouseService: WarehouseService) {}

  @Get("/:id")
  getWarehouse(@Param("id", ParseIntPipe) id: number) {
    return this.warehouseService.findOne(id);
  }
  @Get()
  getWarehouses() {
    return this.warehouseService.findAll();
  }

  @Post()
  createWarehouse(@Body() body: CreateWarehouseDto) {
    return this.warehouseService.create(body);
  }

  @Patch("/:id")
  updateWarehouse(
    @Param("id", ParseIntPipe) warehouseId: number,
    @Body() body: UpdateWareHouseDto,
  ) {
    return this.warehouseService.update(warehouseId, body);
  }

  @Delete("/:id")
  removeWarehouse(@Param("id", ParseIntPipe) id: number) {
    return this.warehouseService.remove(id);
  }
}
