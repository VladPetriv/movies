import { Connection, createConnection } from 'typeorm';

export class TestHelper {
  name: string;
  entities: any;
  constructor(name: string, entities: any) {
    this.name = name;
    this.entities = entities;
  }
  public async createTestConnection(): Promise<Connection> {
    const connection = await createConnection({
      type: 'postgres',
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      dropSchema: true,
      entities: this.entities,
      synchronize: true,
      logging: false,
      name: this.name,
    });
    return connection;
  }
}
