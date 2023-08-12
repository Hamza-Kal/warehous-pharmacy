import { Role } from 'src/shared/enums/roles';
import { User } from 'src/user/entities/user.entity';

export class GetAllGuestsDto {
  id: number;
  email: string;
  assignedRole: Role;
  constructor({ user }: { user: User }) {
    this.id = user.id;
    this.email = user.email;
    this.assignedRole = user.assignedRole;
  }

  toObject(): {
    id: number;
    email: string;
    assignedRole: Role;
  } {
    return {
      id: this.id,
      email: this.email,
      assignedRole: this.assignedRole,
    };
  }
}
