import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'myemail@gmail.com', description: 'User email' })
  readonly email: string;

  @ApiProperty({ example: 'mypassword', description: 'User password' })
  readonly password: string;
}
