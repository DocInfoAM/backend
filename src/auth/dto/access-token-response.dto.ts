import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenResponseDto {
  @ApiProperty({
    description: 'The access token for the user.',
  })
  accessToken: string;
}
