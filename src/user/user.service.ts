import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, StreamDescription } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { Role } from 'src/enums/roles';
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
  async createOne(data: any) {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async update(id: number, data: Partial<CreateUserDto>) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found !');
    //method 1 :
    //if the sent entity does not exist it insert it else it updates it partailly
    //it is faster the save
    //it returns the logs of the operation in db
    //return await this.userRepository.update(id, data);
    //method 2 :
    //slower than update because it searches for the entity first
    //Saves a given entity in the database. If entity does not exist in the database then inserts, otherwise updates.
    Object.assign(user, data);
    return this.userRepository.save(user);
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
