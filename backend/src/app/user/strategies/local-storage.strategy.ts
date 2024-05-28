
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { IStorageStrategy } from './storage.strategy';

@Injectable()
export class LocalStorageStrategy implements IStorageStrategy {
  async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadPath = './uploads/avatars';
    const extension = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uuid()}${extension}`;

    if (!fs.existsSync(extension)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const fullPath = path.join(uploadPath, filename);
    fs.writeFileSync(fullPath, file.buffer);

    return Promise.resolve(`uploads/avatars/${filename}`);
  }
}