import { User } from 'src/user/entities/user.entity';

export interface IRegisterStrategy {
  register(data: any): Promise<User>;
}
