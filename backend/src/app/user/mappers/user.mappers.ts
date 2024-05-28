import { UserEntity } from '../entity/user.entity';
import { UserDto } from '../entity/user.dto';

export function userEntitiesToUserDto(user: UserEntity[]): UserDto[] {
  return user.map(toUserDto);
}
export function toUserDto(user: UserEntity): UserDto {
  const { id, email, username, registeredAt, roles, avatarUrl } = user;
  return { id, email, username, registeredAt, roles, avatarUrl };
}