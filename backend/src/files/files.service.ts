import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

@Injectable()
export class FilesService {
  async createFile(file: any): Promise<string> {
    try {
      const fileName = v4() + '.jpg';
      const filePath = resolve(__dirname, '..', 'static');
      if (!existsSync(filePath)) {
        mkdirSync(filePath, { recursive: true });
      }
      writeFileSync(join(filePath, fileName), file.buffer);
      return fileName;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Error while writing file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
