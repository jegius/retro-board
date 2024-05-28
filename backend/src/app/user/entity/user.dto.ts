import { RoleEntity } from '../../role/entity/role.entity';

export class UserDto {
  id: number;
  email: string;
  username: string;
  registeredAt: Date;
  roles: RoleEntity[];
  avatarUrl?: string;
}