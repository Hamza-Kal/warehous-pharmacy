import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Role } from 'src/shared/enums/roles';

import { IParams } from 'src/shared/interface/params.interface';
import { GetAllGuestsDto } from '../dtos/response/get-all-guests.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { GetBannedUsersDto } from '../dtos/response/get-banned-users.dto';
import { UserError } from './user-error.service';
import { Pagination } from 'src/shared/pagination/pagination.validation';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Pharmacy)
    private pharmacyRepostiory: Repository<Pharmacy>,
    private readonly userError: UserError,
  ) {}

  async findActive() {
    const users = await this.userRepository.find({
      relations: {
        inventory: true,
        warehouse: true,
        supplier: true,
        pharmacy: true,
      },
    });
    return {
      data: users.map((user) => new GetAllGuestsDto({ user }).toObject()),
    };
  }
  async getAllGuests() {
    const users = await this.userRepository.find({
      select: { email: true, id: true, assignedRole: true, fullName: true },
      where: {
        completedAccount: true,
        role: Role.GUEST,
      },
      relations: {
        inventory: true,
        warehouse: true,
        supplier: true,
        pharmacy: true,
      },
    });
    const guestUsers = users.map((user: User) =>
      new GetAllGuestsDto({ user }).toObject(),
    );
    return {
      data: guestUsers.filter((user) => user.property),
    };
  }

  async completeInfo(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    user.completedAccount = true;
    await this.userRepository.save(user);
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: {
        pharmacy: true,
        supplier: true,
        inventory: true,
        warehouse: true,
      },
    });
    return user;
  }

  async isAccepted(currUser: IUser) {
    const user = await this.userRepository.findOne({
      where: {
        id: currUser.id as number,
        role: Not(Role.GUEST),
      },
    });
    return !!user;
  }

  async acceptAccount({ id }: IParams) {
    const user = await this.userRepository.findOneBy({
      id: +id,
      role: Role.GUEST,
      completedAccount: true,
    });
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    user.role = user.assignedRole;
    await this.userRepository.save(user);
    return;
  }

  async createOne(data: CreateUserDto) {
    const user = this.userRepository.create(data);
    await this.userRepository.save(user);

    return user;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found !');
    return this.userRepository.remove(user);
  }

  async setRole(id: number, role: Role) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new NotFoundException('there is no user with the given id');
    user.role = role;
    return this.userRepository.save(user);
  }
  async banUser(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        supplier: true,
        warehouse: true,
        inventory: true,
        pharmacy: true,
      },
    });
    if (!user) throw new NotFoundException('user not found');
    const bannedUser = await this.userRepository.softRemove(user);

    if (user.supplier) await this.supplierRepository.softRemove(user.supplier);
    if (user.warehouse)
      await this.warehouseRepository.softRemove(user.warehouse);
    if (user.inventory)
      await this.inventoryRepository.softRemove(user.inventory);
    if (user.pharmacy) await this.pharmacyRepostiory.softRemove(user.pharmacy);
    return {
      data: new GetAllGuestsDto({ user: bannedUser }).toObject(),
    };
  }
  async recoverUser(id: number) {
    const user = await this.userRepository.findOne({
      withDeleted: true,
      where: {
        id,
      },
      relations: {
        supplier: true,
        warehouse: true,
        inventory: true,
        pharmacy: true,
      },
    });
    if (!user) throw new NotFoundException('user not found');
    if (user.deleted_at === null)
      throw new BadRequestException('this user is not banned');
    const restoredUser = await this.userRepository.recover(user);
    if (user.supplier) await this.supplierRepository.recover(user.supplier);
    if (user.warehouse) await this.warehouseRepository.recover(user.warehouse);
    if (user.inventory) await this.inventoryRepository.recover(user.inventory);
    if (user.pharmacy) await this.pharmacyRepostiory.recover(user.pharmacy);
    return {
      data: new GetAllGuestsDto({ user: restoredUser }).toObject(),
    };
  }

  async getBannedUsers() {
    const users = await this.userRepository.find({
      withDeleted: true,
      where: {
        deleted_at: Not(IsNull()),
      },
      relations: {
        warehouse: true,
        supplier: true,
        inventory: true,
        pharmacy: true,
      },
    });
    return {
      data: users.map((user) => new GetBannedUsersDto({ user }).toObject()),
    };
  }

  async editUser(body: UpdateUserDto, curUser: IUser) {
    const { id } = curUser;
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    Object.assign(user, body);
    await this.userRepository.save(user);
    return {
      data: {
        id: user.id,
      },
    };
  }

  async findUser(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      this.userError.notFoundUser();
    }
    return user;
  }
  async findRole(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        supplier: true,
        pharmacy: true,
        warehouse: true,
      },
      select: {
        supplier: { name: true },
        warehouse: { name: true },
        pharmacy: { name: true },
      },
    });

    if (!user) {
      this.userError.notFoundUser();
    }
    return user;
  }

  // async getPayment(
  //   user: IUser,
  //   { pagination, criteria }: { pagination: Pagination; criteria: any },
  // ) {
  //   const userPayment = await this.userRepository.find({
  //     where: {
  //       outcomingPayments: {
  //         sender: {
  //           id: user.id,
  //         },
  //       },
  //     },
  //   });
  // }
}
