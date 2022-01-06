import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'myemail@gmail.com', description: 'User email' })
  @IsEmail({}, { message: 'Invalid email' })
  readonly email: string;

  @ApiProperty({ example: 'mypassword', description: 'User password' })
  @Length(4, 15, { message: 'Password must be between 4-15 chars' })
  readonly password: string;
}
