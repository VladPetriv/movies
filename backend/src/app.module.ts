import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.entity';
import { FavouriteModule } from './favourite/favourite.module';
import { Favourite } from './favourite/entities/favourite.entity';
import { FavouriteItem } from './favourite/entities/favourite-item.entity';
import { MoviesModule } from './movies/movies.module';
import { Movie } from './movies/movie.entity';
import { FilesModule } from './files/files.module';
import { ActorsModule } from './actors/actors.module';
import { Actor } from './actors/actor.entity';
import { GenresModule } from './genres/genres.module';
import { Genre } from './genres/genre.entity';
import { RatingModule } from './rating/rating.module';
import { Rating } from './rating/rating.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        User,
        Role,
        Favourite,
        FavouriteItem,
        Movie,
        Actor,
        Genre,
        Rating,
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    FavouriteModule,
    MoviesModule,
    FilesModule,
    ActorsModule,
    GenresModule,
    RatingModule,
  ],
})
export class AppModule {}
