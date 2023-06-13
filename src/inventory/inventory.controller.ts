import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
} from "@nestjs/common";
import { UpdateDescription } from "typeorm";
import { CreateInventoryDto } from "./dtos/create-inventory.dto";
import { UpdateInventoryDto } from "./dtos/update-inventory.entity";
import { InventoryService } from "./inventory.service";

@Controller("inventory")
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get("/:id")
  getInventory(@Param("id", ParseIntPipe) inventoryId: number) {
    return this.inventoryService.findOne(inventoryId);
  }
  @Get()
  getInventories() {
    return this.inventoryService.findAll();
  }

  @Post()
  async createInventory(@Body() body: CreateInventoryDto) {
    return this.inventoryService.create(body);
  }

  @Patch("/:id")
  updateInventory(
    @Param("id", ParseIntPipe) inventoryId: number,
    @Body() body: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(inventoryId, body);
  }
}
