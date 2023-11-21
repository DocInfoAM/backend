import { Public } from '../../libs/decorators';
import { Cookie, UserAgent } from './decorators';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  AccessTokenResponseDto,
  LoginDto,
  MessageResponseDto,
  RegisterDto,
} from './dto';
import { ITokens } from './types/auth.interface';
import { CookiesEnum } from '../../config/enums/cookies.enum';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseErrorMessageDto } from '../../config/dto';

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'New User Registration' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ResponseErrorMessageDto,
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict',
    type: ResponseErrorMessageDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const user = await this.authService.register(dto);

    if (!user) {
      throw new BadRequestException('Failed to register user');
    }

    res
      .status(HttpStatus.CREATED)
      .json({ message: 'User successfully registered' });
  }

  @ApiOperation({ summary: 'User Login' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Tokens successfully generated',
    type: AccessTokenResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ResponseErrorMessageDto,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ResponseErrorMessageDto,
  })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    const tokens = await this.authService.login(dto, agent);

    if (!tokens) {
      throw new BadRequestException('Failed to login user');
    }

    this.setRefreshTokenToCookies(tokens, res);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'User successfully logout',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ResponseErrorMessageDto,
  })
  @ApiCookieAuth(CookiesEnum.REFRESH_TOKEN)
  @Get('logout')
  async logout(
    @Cookie(CookiesEnum.REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ) {
    if (!refreshToken) {
      res.status(HttpStatus.OK).json({ message: 'User successfully logout' });
      return;
    }

    await this.authService.deleteRefreshToken(refreshToken).catch(() => {
      throw new BadRequestException('Failed to delete refresh token');
    });

    res.cookie(CookiesEnum.REFRESH_TOKEN, '', {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });

    res.status(HttpStatus.OK).json({ message: 'User successfully logout' });
  }

  @ApiOperation({ summary: 'Get new tokens' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Tokens successfully generated',
    type: AccessTokenResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ResponseErrorMessageDto,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ResponseErrorMessageDto,
  })
  @Get('refresh-tokens')
  async refreshTokens(
    @Cookie(CookiesEnum.REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.authService.refreshTokens(refreshToken, agent);

    if (!tokens) {
      throw new UnauthorizedException();
    }

    this.setRefreshTokenToCookies(tokens, res);
  }

  private setRefreshTokenToCookies(tokens: ITokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException();
    }

    res.cookie(CookiesEnum.REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.expired),
      secure:
        this.configService.get('VERCEL_NODE_ENV', 'development') ===
        'production',
      path: '/',
    });

    res
      .status(HttpStatus.CREATED)
      .json({ accessToken: tokens.accessToken })
      .send();
  }
}
