import { HttpException, HttpStatus } from "@nestjs/common";
import * as path from "path";
import { diskStorage } from "multer";
import * as uuid from "uuid";
import * as fs from "fs";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export const multerConfig = {
  dest: "./uploads",
  maxSize: 30e7,
};

export const multerOptions: MulterOptions = {
  limits: {
    fileSize: multerConfig.maxSize,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${path.extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST
        ),
        false
      );
    }
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest;
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, `${uuid.v4()}${path.extname(file.originalname)}`);
    },
  }),
};
