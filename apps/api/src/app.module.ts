import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AppConfig } from './config/app.config';
import { DatabaseConfig } from './config/database.config';
import { JwtConfig } from './config/jwt.config';
import { AuthModule } from './auth/auth.module';
import { Invitation } from './auth/entities/invitation.entity';
import { LearningModule } from './learning/learning.module';
import { ParentsModule } from './parents/parents.module';
import { UploadModule } from './upload/upload.module';
import { Progress } from './learning/entities/progress.entity';
import { Reward } from './learning/entities/reward.entity';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, DatabaseConfig, JwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        entities: [User, Invitation, Progress, Reward],
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
      }),
    }),
    AuthModule,
    UsersModule,
    LearningModule,
    ParentsModule,
    AdminModule,
    UploadModule,
  ],
})
export class AppModule {}
