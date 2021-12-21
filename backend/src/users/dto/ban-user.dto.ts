import { ApiProperty } from '@nestjs/swagger';
export class BanUserDto {
  @ApiProperty({ example: '1', description: 'User id' })
  readonly userId: number;
  @ApiProperty({
    example: 'Using bad words',
    description: 'Reason why user is banned',
  })
  readonly reason: string;
}
