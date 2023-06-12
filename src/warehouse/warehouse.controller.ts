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
import { WarehouseService } from "./warehouse.service";

@Injectable()
@Controller("warehouse")
export class WarehouseController {
  constructor(private wareHouseService: WarehouseService) {}

  @Post()
  createWarehouse(@Body() body: CreateWarehouseDto) {
    return this.wareHouseService.create(body);
  }

  @Delete("/:id")
  removeWarehouse(@Param("id", ParseIntPipe) id: number) {
    return this.wareHouseService.remove(id);
  }
}
