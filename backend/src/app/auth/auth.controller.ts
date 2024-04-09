import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin(): void {
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: Request): Promise<any> {
    const user = await this.authService.validateUser(req.user);
    return this.authService.login(user);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin(): void {
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubLoginCallback(@Req() req: Request): Promise<any> {
    const user = await this.authService.validateUser(req.user);
    return this.authService.login(user);
  }
}