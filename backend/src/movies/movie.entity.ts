import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
  @ApiProperty({ example: '1', description: 'Unique movie id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example:'image.jpg',description:'Movie poster'})
  @Column({
    nullable:false
  })
  poster:string

  @ApiProperty({ example: 'Terminator', description: 'Movie title' })
  @Column({
    nullable: false,
  })
  title: string;

  @ApiProperty({
    example: 'This movie is about...',
    description: 'Movie description',
  })
  @Column({
    nullable: false,
  })
  description: string;

  @ApiProperty({ example: 2020, description: 'Year when movie was created' })
  @Column({
    nullable: false,
  })
  year: number;

  @ApiProperty({
    example: 'USA',
    description: 'Country where movie was created',
  })
  @Column({
    nullable: false,
  })
  country: string;

  @ApiProperty({ example: '200000$', description: 'Budget for movie' })
  @Column({
    nullable: false,
  })
  budget: string;
}
