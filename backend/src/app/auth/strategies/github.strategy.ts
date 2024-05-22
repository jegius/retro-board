import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../user/entity/user.entity';
import { generateRandomHashedPassword } from '../../../utils';
import process from 'process';
import { RoleService } from '../../role/role.service';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly usersService: UserService, private readonly rolesService: RoleService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CLIENT_SECRET,
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<Omit<UserEntity, any>> {
    const { displayName: username, emails } = profile;
    const email = emails[0].value;

    let user = await this.usersService.findOneByEmail(email);

    if (!user) {
      const role = await this.rolesService.findOneByName(process.env.USER_ROLE_NAME)
      const { salt, hashedPassword } = generateRandomHashedPassword();

      user = await this.usersService.create({
        username,
        email,
        password: hashedPassword,
        roles: [role]
      } as UserEntity);
    }
    return user;
  }
}