import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { PostsService } from './posts.service'
// import { Post as PostInterface } from './interfaces/post.interface'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostExistsPipe } from './pipes/post-exists.pipe'
import { Post as PostEntity } from './entities/post.entity'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { Roles } from 'src/auth/decorators/roles.decorators'
import { UserRole } from 'src/auth/entities/user.entity'
import { RolesGuard } from 'src/auth/guards/roles-guard'

@Controller('posts')
export class PostsController {
  constructor (private readonly postsService: PostsService) {}

  // Get  ->  http://localhost:3000/posts
  @Get()
  async findAll (): Promise<PostEntity[]> {
    return this.postsService.findall()
  }

  // Get  ->  http://localhost:3000/posts/1
  @Get(':id')
  async findById (
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
  ): Promise<PostEntity> {
    return this.postsService.findById(id)
  }

  // Post  ->  http://localhost:3000/posts/create
  // Body  ->  { "title": "new post", "content": "this is a new post from postman", "authorName": "postman author" }
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  )
  async create (
    @Body() createPostData: CreatePostDto,
    @CurrentUser() user: any,
  ): Promise<PostEntity> {
    return this.postsService.create(createPostData, user)
  }

  // Put  ->  http://localhost:3000/posts/4
  // Body  ->  { "title": "updated post", "content": "this is a updated post from postman", "authorName": "updated author" }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
    @Body() updatePostData: UpdatePostDto,
    @CurrentUser() user: any,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostData, user)
  }

  //  Im allowing only aadmin to delete a post
  // Delete  ->  http://localhost:3000/posts/4
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete (
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
  ): Promise<void> {
    return this.postsService.delete(id)
  }
}
