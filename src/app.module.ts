import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/modules/users.module';
import { AuthModule } from './authentication/auth.module';
import { ConfigModule } from '@nestjs/config';
import { NODE_ENV } from './app.constant';
import { DatabaseModule } from './database/database.module';
import { ProfileModule } from './profile/profile.module';
import { PostsModule } from './posts/modules/posts.module';
import { LikesModule } from './posts/modules/likes.module';
import { PostPhotosModule } from './posts/modules/post-photos.module';
import { MulterModule } from './multer/multer.module';
import { CommentariesModule } from './posts/modules/commentaries.module';
import { MessagesModule } from './messages/messages.module';
import { PhotoUserModule } from './users/modules/photo-user.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [
    MulterModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        NODE_ENV: Joi.string()
          .required()
          .valid(NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_SECRET: Joi.string().required()
      })
    }),
    UserModule,
    AuthModule,
    DatabaseModule,
    ProfileModule,
    PostsModule,
    LikesModule,
    PostPhotosModule,
    CommentariesModule,
    MessagesModule,
    PhotoUserModule,
    FriendsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
