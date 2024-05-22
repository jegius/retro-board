import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../user/entity/user.entity';
import { generateRandomHashedPassword } from '../../../utils';
import { UserService } from '../../user/services/user.service';
import { RoleService } from '../../role/role.service';
import * as process from 'process';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UserService, private readonly rolesService: RoleService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile']
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