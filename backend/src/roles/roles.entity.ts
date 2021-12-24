import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Role {
  @ApiProperty({ example: '1', description: 'Role id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'USER', description: 'Role value' })
  @Column({
    nullable: false,
    unique: true,
  })
  value: string;

  @ApiProperty({ example: 'Default user', description: 'Role description' })
  @Column({
    nullable: false,
  })
  description: string;
}
