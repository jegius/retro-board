import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../user/entity/user.entity';
import { generateRandomHashedPassword } from '../../../utils';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CLIENT_SECRET,
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<Omit<UserEntity, any>> {
    const { id, username, emails } = profile;
    const { salt, hashedPassword } = generateRandomHashedPassword();
    return {
      id: Number(`${id}`.slice(0, 10)),
      username,
      email: emails[0].value,
      password: hashedPassword,
    };
  }
}