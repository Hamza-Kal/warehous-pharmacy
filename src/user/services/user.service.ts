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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    return {
      data: users.map((user: User) => new GetAllGuestsDto({ user }).toObject()),
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
        supplier: true,
        inventory: true,
        warehouse: true,
        pharmacy: true,
      },
    });
    return user;
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
    });
    if (!user) throw new NotFoundException('user not found');
    const bannedUser = await this.userRepository.softRemove(user);
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
    });
    if (!user) throw new NotFoundException('user not found');
    if (user.deleted_at === null)
      throw new BadRequestException('this user is not banned');
    const restoredUser = await this.userRepository.recover(user);
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
    });
    return {
      data: users.map((user) => new GetAllGuestsDto({ user }).toObject()),
    };
  }
}
