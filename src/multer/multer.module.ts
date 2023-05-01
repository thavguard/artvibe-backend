import { MulterModule as MulterModuleLib } from "@nestjs/platform-express";
import { Module } from "@nestjs/common";
import { multerConfig } from "./configs/multer.config";

@Module({
  imports: [
    MulterModuleLib.register({
      dest: multerConfig.dest,
    }),
  ],
})
export class MulterModule {}
