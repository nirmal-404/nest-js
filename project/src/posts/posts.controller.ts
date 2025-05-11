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
import { FindPostsQueryDto } from './dto/find-posts-query.dto'
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface'

@Controller('posts')
export class PostsController {
  constructor (private readonly postsService: PostsService) {}

  @Get()
  async findAll (
    @Query() query: FindPostsQueryDto,
  ): Promise<PaginatedResponse<PostEntity>> {
    return this.postsService.findAll(query)
  }

  @Get(':id')
  async findById (
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
  ): Promise<PostEntity> {
    return this.postsService.findById(id)
  }

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

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
    @Body() updatePostData: UpdatePostDto,
    @CurrentUser() user: any,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostData, user)
  }

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
