import { Module } from '@nestjs/common'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from './entities/post.entity'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [
    // this will make  the post repository available for injection
    // avaliale in the current scope
    TypeOrmModule.forFeature([Post]),
    AuthModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
