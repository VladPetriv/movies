import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'USER', description: 'Role value' })
  readonly value: string;

  @ApiProperty({ example: 'Super user', description: 'What it mean' })
  readonly description: string;
}
