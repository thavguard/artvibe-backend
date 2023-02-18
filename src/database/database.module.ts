import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NODE_ENV } from "../app.constant";
import { User } from "../users/entities/user.entity";
import { AuthenticationSubscriber } from "../authentication/subscribers/authentication.subscriber";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("POSTGRES_HOST"),
        port: configService.get("POSTGRES_PORT"),
        username: configService.get("POSTGRES_USER"),
        password: configService.get("POSTGRES_PASSWORD"),
        database: configService.get("POSTGRES_DB"),
        entities: [__dirname + "/../**/*.entity{.ts,.js}"],
        synchronize: configService.get("NODE_ENV") === NODE_ENV.DEVELOPMENT,
        logging: configService.get("NODE_ENV") === NODE_ENV.DEVELOPMENT,
        subscribers: [AuthenticationSubscriber],
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
