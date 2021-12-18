import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/roles-entity';

@Entity()
export class User {
  @ApiProperty({ example: '1', description: 'Unique user id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'myemail@gmail.com', description: 'User email' })
  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @ApiProperty({ example: 'mypassword', description: 'User password' })
  @Column({
    nullable: false,
  })
  password: string;

  @ApiProperty({ example: 'true', description: 'User status banned or not' })
  @Column({
    default: false,
  })
  ban: boolean;

  @ApiProperty({
    example: 'Using bad words',
    description: 'Reason why user get banned',
  })
  @Column({
    nullable: true,
  })
  banReason: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
