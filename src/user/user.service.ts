import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(data: any) {
    return await this.userRepository.findOne(data);
  }

  async createOne(data: any) {
    try {
      const user = new User();
      // testing
      user.email = data;
      user.password = data;
      user.fullName = data;
      user.username = data;
      console.log(user);
      this.userRepository.create(user);
      this.userRepository.save(user);
      return 'created';
    } catch (err) {
      console.log(err.message);
      return 'NotCreated';
    }
  }
}
