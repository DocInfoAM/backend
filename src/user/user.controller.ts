import { CurrentUser, Public } from '../../libs/decorators';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserResponseDto } from './dto';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CookiesEnum } from '../../config/enums/cookies.enum';
import { JwtPayloadDto, ResponseErrorMessageDto } from '../../config/dto';
import { Response } from 'express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: JwtPayloadDto,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ResponseErrorMessageDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ResponseErrorMessageDto,
  })
  @ApiCookieAuth(CookiesEnum.REFRESH_TOKEN)
  @Get('me')
  me(@CurrentUser() user: JwtPayloadDto) {
    return user;
  }

  @Public()
  @ApiOperation({ summary: 'Get user by ID or Email' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'User response',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ResponseErrorMessageDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':idOrEmail')
  async findOneUser(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.userService.findOne(idOrEmail);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return new UserResponseDto(user);
  }

  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden exception',
    type: ResponseErrorMessageDto,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ResponseErrorMessageDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ResponseErrorMessageDto,
  })
  @ApiCookieAuth(CookiesEnum.REFRESH_TOKEN)
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayloadDto,
    @Res() res: Response,
  ) {
    const deletedUser = await this.userService.delete(id, currentUser);

    if (deletedUser?.id !== id) {
      throw new BadRequestException('Failed to delete user');
    }

    res.sendStatus(HttpStatus.OK);
  }

  @ApiBody({
    description: 'The current user to update',
    type: UserResponseDto,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ResponseErrorMessageDto,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
    type: ResponseErrorMessageDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ResponseErrorMessageDto,
  })
  @ApiCookieAuth(CookiesEnum.REFRESH_TOKEN)
  @UseInterceptors(ClassSerializerInterceptor)
  @Put()
  async updateUser(
    @Body() body: Partial<User>,
    @CurrentUser() currentUser: JwtPayloadDto,
  ) {
    const user = await this.userService.update(body, currentUser);

    if (!user) {
      throw new BadRequestException('Failed to update user');
    }

    return new UserResponseDto(user);
  }
}
