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
      database: 'tests',
      host: 'localhost',
      port: 5432,
      username: 'vlad',
      password: 'admin',
      dropSchema: true,
      entities: this.entities,
      synchronize: true,
      logging: false,
      name: this.name,
    });
    return connection;
  }
}
