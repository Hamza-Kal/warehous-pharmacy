import { IsEnum } from 'class-validator';
import { Role } from 'src/shared/enums/roles';

export class DeleteComplaintDto {
  @IsEnum(Role)
  actorRole: Role;

  @IsEnum(Role)
  complaintedRole: Role;
}
