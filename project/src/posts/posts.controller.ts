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
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { Posts } from './interfaces/post.interface'

@Controller('posts')
export class PostsController {
  constructor (private readonly postsService: PostsService) {}

  // Get  ->  http://localhost:3000/posts
  // Get  ->  http://localhost:3000/posts?search=Post 3
  @Get()
  findAll (@Query('search') search: string) {
    const extractAllPosts = this.postsService.findall()

    if (search) {
      return extractAllPosts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()),
      )
    }
    return extractAllPosts
  }

  // Get  ->  http://localhost:3000/posts/1
  @Get(':id')
  findById (@Param('id', ParseIntPipe) id: number): Posts {
    return this.postsService.findById(id)
  }

  // Post  ->  http://localhost:3000/posts/create
  // Body  ->  { "title": "new post", "content": "this is a new post from postman", "authorName": "postman author" }
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create (@Body() createPostData: Omit<Posts, 'id' | 'createdAt'>): Posts {
    return this.postsService.create(createPostData)
  }

  // Put  ->  http://localhost:3000/posts/4
  // Body  ->  { "title": "updated post", "content": "this is a updated post from postman", "authorName": "updated author" }
  @Put(':id')
  update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostData: Omit<Posts, 'id' | 'createdAt'>,
  ): Posts {
    return this.postsService.update(id, updatePostData)
  }

  // Delete  ->  http://localhost:3000/posts/4
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete (@Param('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id)
  }
}
