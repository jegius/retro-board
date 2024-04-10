import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Google Login' })
  @ApiResponse({ status: 200, description: 'UserEntity is authenticated through Google' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin(): void {
  }

  @ApiOperation({ summary: 'Google Login Callback' })
  @ApiOkResponse({
    description: 'UserEntity is authenticated through Google and redirected',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'def50200a9c18b6a35...',
        profile: {
          id: '123456789',
          displayName: 'John Doe',
          emails: [{ value: 'example@gmail.com' }],
        }
      }
    }
  })

  @ApiResponse({ status: 302, description: 'The user is redirected to the original URL.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: Request): Promise<any> {
    const user = await this.authService.validateUser(req.user);
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'GitHub Login' })
  @ApiResponse({ status: 200, description: 'UserEntity is authenticated through GitHub' })
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin(): void {
  }

  @ApiOperation({ summary: 'GitHub Login Callback' })
  @ApiOkResponse({
    description: 'UserEntity is authenticated through GitHub and redirected',
    schema: {
      example: {
        accessToken: 'ghp_luCIsoJmL4098PDnLPDa4zG7qsa...',
        refreshToken: null,
        profile: {
          id: '987654321',
          username: 'janedoe',
          emails: [{ value: 'example@github.com' }],
        }
      }
    }
  })

  @ApiResponse({ status: 302, description: 'The user is redirected to the original URL.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubLoginCallback(@Req() req: Request): Promise<any> {
    const user = await this.authService.validateUser(req.user);
    return this.authService.login(user);
  }
}