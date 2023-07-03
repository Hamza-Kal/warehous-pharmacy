import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, StreamDescription } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Role } from 'src/shared/enums/roles';
import passport from 'passport';
import { IsStrongPassword } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneById(id: number) {
    if (!id) throw new NotFoundException('user not found !');
    return await this.userRepository.findOneBy({ id });
  }
  async find() {
    return this.userRepository.find();
  }

  async findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }
  async findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findOneByUsernameOrEmail(username: string, email: string) {
    return await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
  }
  async createOne(data: CreateUserDto) {
    const user = this.userRepository.create(data);
    await this.userRepository.save(user);
    delete user.password;
    delete user.role;
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
