import { User } from 'src/user/entities/user.entity';

export interface IAuthStrategies {
  register(data: any): Promise<User>;
}
