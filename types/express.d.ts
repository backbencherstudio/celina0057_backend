import { Multer } from 'multer';
import { Request } from 'express';

declare global {
  
  namespace Express {
    interface Request {
      user?: any;
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}
