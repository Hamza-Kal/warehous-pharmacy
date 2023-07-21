import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, StreamDescription } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Role } from 'src/shared/enums/roles';
import passport, { use } from 'passport';
import { IsStrongPassword } from 'class-validator';
import { error } from 'console';
import { IParams } from 'src/shared/interface/params.interface';
import { where } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllGuests() {
    return this.userRepository.find({
      where: { role: Role.GUEST },
      select: { username: true, email: true, id: true },
    });
  }

  async findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async completeInfo(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    user.completedAccount = true;
    await this.userRepository.save(user);
    return user;
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
  async findOneByUsernameOrEmail(username: string, email: string) {
    return await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
  }

  async acceptAccount({ id }: IParams) {
    const user = await this.userRepository.findOneBy({ id, role: Role.GUEST });
    user.role = user.assignedRole;
    this.userRepository.save(user);
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
}
