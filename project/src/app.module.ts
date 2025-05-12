import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PostsModule } from './posts/posts.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from './posts/entities/post.entity'
import { AuthModule } from './auth/auth.module'
import { User } from './auth/entities/user.entity'
import { ThrottlerModule } from '@nestjs/throttler'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { FileUploadModule } from './file-upload/file-upload.module';
import { File } from './file-upload/entities/file.entity'
import { EventsModule } from './events/events.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    CacheModule.register({
      isGlobal: true,
      ttl: 30000, // 30seconds
      max: 100, // maximum number of items in cache
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'nestjs-node-4',
      entities: [Post, User, File], // array of entities to be used by TypeORM
      synchronize: true, // dev mode only, do not use in production
    }),
    PostsModule,
    AuthModule,
    FileUploadModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    //apply the middleware for all the routes
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
