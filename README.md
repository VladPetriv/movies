# Movies

This is a example of backend side for movie library

frontend side in development)

## Technology which was used

This application was build using NodeJS as platform with typescript and backend framework NestJS

For database was used Postgresql with orm like TypeORM

For testing was used Jest and Postgresql


## Installation for development

```bash
# make sure postgresql is installed on your system

# Clone the repo and install dependencies
$ git clone git@github.com:VladPetriv/movies.git
$ cd movies/backend
$ npm install
```

## API Endpoints
For checking all api endpoints you can visit url : "http://localhost:[port]/api/docs"


## Usage

Starting the server with docker,docker-compose:

Docker setuped only for development

```bash
# To start the server make sure you're in the 'movies/backend'
# Make sure that you have installed docker at your PC

#First step is changing .development.env with your value
#This file you have at source directory

# Second step is building docker image
$ docker-compose build

# Third step is running docker image
$ docker-compose up

```

## Running the test suite
In this application there are unit tests for all modules)

```bash
# Make sure you're in the movie/backend root directory and run:
# Make sure that you have installed postgresql at your pc
# First step is creating the .test.env with fields like :[
#  PORT=your port
#  POSTGRES_HOST=your db host
#  POSTGRES_PORT=your db port
#  POSTGRES_USER=your db user
#  POSTGRES_PASSWORD=your db password 
#  POSTGRES_DB=your db name
#  SECRET_KEY=your secret key for jwt
#]
$ npm run test
```
