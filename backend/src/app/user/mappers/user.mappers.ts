import { UserEntity } from '../entity/user.entity';
import { UserDto } from '../entity/user.dto';

export async function userEntitiesToUserDto(user: UserEntity[]): Promise<UserDto[]> {
  return await Promise.all(user.map(toUserDto));
}
export async function toUserDto(user: UserEntity): Promise<UserDto> {
  const { id, email, username, registeredAt, roles, avatarUrl } = user;
  const syncedRoles = await roles;
  return { id, email, username, registeredAt, roles: syncedRoles, avatarUrl };
}