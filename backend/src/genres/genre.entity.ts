import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Genre {
  @ApiProperty({ example: '1', description: 'Unique genre id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Horror', description: 'Unique genre name' })
  @Column({ nullable: false, unique: true })
  name: string;

  @ApiProperty({
    example: 'This genre is...',
    description: 'Genre description',
  })
  @Column({ nullable: false })
  description: string;
}
