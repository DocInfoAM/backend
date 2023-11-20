import { DocumentBuilder } from '@nestjs/swagger';

export default () =>
  new DocumentBuilder()
    .setTitle('DocInfoAM')
    .setDescription('The DocInfoAM API description')
    .addCookieAuth(
      'authCookie',
      {
        type: 'http',
        in: 'Header',
        scheme: 'Bearer',
      },
      'refresh_token',
    )
    .setVersion('0.1.0')
    .build();
