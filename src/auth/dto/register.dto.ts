import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class RegisterDto implements Partial<User> {
  @ApiProperty({
    description: 'User Email',
    default: 'test@mail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mobile phone number',
    default: '+374-28-37-49-05',
  })
  phone: string;

  @ApiProperty({
    description: 'User password. Min length 6 symbols',
    default: '123456',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
