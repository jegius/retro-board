import {
  BadRequestException,
  HttpException, HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/services/user.service';

import * as bcrypt from 'bcrypt';
import { RegistrationDto } from './entity/registration.dto';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async validateUser(oauthUser: any): Promise<any> {
    let user = await this.userService.findOneByEmail(oauthUser.email);
    if (!user) {
      user = await this.userService.create(oauthUser);
    }
    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d'
    });
    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(currentRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(currentRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET
      });
      const user = await this.userService.findOne(payload.sub);

      if (!user) {
        throw new Error('User not found');
      }

      return this.login(user);
    } catch (err) {
      throw new Error('Refresh token invalid');
    }
  }

  async validateUserCredentials(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async register(registrationDto: RegistrationDto): Promise<UserEntity> {
    const { email, password, username } = registrationDto;

    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new HttpException('User with this email already exists.', HttpStatus.BAD_REQUEST);
    }

    const newUser = new UserEntity();
    newUser.email = email;
    newUser.username = username;
    newUser.password = password;

    return this.userService.create(newUser);
  }
}