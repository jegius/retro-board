import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './entity/login.dto';
import { RegistrationDto } from './entity/registration.dto';
import { logger } from 'nx/src/utils/logger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Google Login' })
  @ApiResponse({ status: 200, description: 'UserEntity is authenticated through Google' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin(): void {
    logger.log('Google login')
  }

  @ApiOperation({ summary: 'Google Login Callback' })
  @ApiOkResponse({
    description: 'UserEntity is authenticated through Google and redirected',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'def50200a9c18b6a35...',
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
    logger.log('GitHub login')
  }

  @ApiOperation({ summary: 'GitHub Login Callback' })
  @ApiOkResponse({
    description: 'UserEntity is authenticated through GitHub and redirected',
    schema: {
      example: {
        accessToken: 'ghp_luCIsoJmL4098PDnLPDa4zG7qsa...',
        refreshToken: 'fett3_nehcggeb%g35bc0...',
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

  @ApiOperation({ summary: 'Token Refresh' })
  @ApiBody({
    description: 'The JSON payload containing the refresh token',
    required: true,
    type: 'object',
    schema: {
      properties: {
        refresh_token: { type: 'string', description: 'The refresh token issued on login.' }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'The access token and refresh token have been successfully refreshed.',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', description: 'The new JWT access token.' },
        refresh_token: { type: 'string', description: 'The new refresh token.' },
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. Refresh token is invalid or expired.' })
  @Post('refresh')
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'def50200a9c18b6a35...',
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'The logged in user data with access_token and refresh_token.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. Wrong credentials.' })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    const user = await this.authService.validateUserCredentials(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'User registration data',
    required: true,
    schema: {
      example: {
        message: 'User has been successfully registered.'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully registered.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. Invalid input data.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registrationDto: RegistrationDto): Promise<{ message: string }> {
    await this.authService.register(registrationDto);
    return { message: 'User has been successfully registered.' };
  }
}