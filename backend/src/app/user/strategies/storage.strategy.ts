export interface IStorageStrategy {
  saveFile(file: Express.Multer.File): Promise<string>;
}