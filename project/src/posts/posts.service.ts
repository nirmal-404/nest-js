import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
// import { Post } from './interfaces/post.interface'
import { Post } from './entities/post.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdatePostDto } from './dto/update-post.dto'
import { CreatePostDto } from './dto/create-post.dto'
import { User, UserRole } from 'src/auth/entities/user.entity'

@Injectable()
export class PostsService {
  // private posts: Post[] = [
  //   {
  //     id: 1,
  //     title: 'Post 1',
  //     content: 'Content of post 1',
  //     authorName: 'Author 1',
  //     createdAt: new Date(),
  //   },
  //   {
  //     id: 2,
  //     title: 'Post 2',
  //     content: 'Content of post 2',
  //     authorName: 'Author 2',
  //     createdAt: new Date(),
  //   },
  //   {
  //     id: 3,
  //     title: 'Post 3',
  //     content: 'Content of post 3',
  //     authorName: 'Author 3',
  //     createdAt: new Date(),
  //   },
  // ]

  constructor (
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  // private getNextId (): number {
  //   return this.posts.length > 0
  //     ? Math.max(...this.posts.map(post => post.id)) + 1
  //     : 1
  // }

  async findall (): Promise<any> {
    const posts = await this.postsRepository.find({
      relations: ['authorName'],
    })

    return posts.map(post => {
      const safeAuthor = {
        id: post.authorName.id,
        name: post.authorName.name,
        role: post.authorName.role,
      }
      const { authorName, ...rest } = post
      return {
        ...rest,
        authorName: safeAuthor,
      }
    })
  }

  async findById (id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['authorName'],
    })

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`)
    }
    return post
  }

  async create (createPostData: CreatePostDto, authorName: User): Promise<Post> {
    const newlyCreatedPost = this.postsRepository.create({
      title: createPostData.title,
      content: createPostData.content,
      authorName,
    })
    return this.postsRepository.save(newlyCreatedPost)
  }

  async update (
    id: number,
    updatePostData: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const currentPost = await this.findById(id)
    if (!currentPost) {
      throw new NotFoundException(`Post with id ${id} not found`)
    }

    if (currentPost.authorName.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(`You can update only your own posts`)
    }

    if (updatePostData.title) {
      currentPost.title = updatePostData.title
    }
    if (updatePostData.content) {
      currentPost.content = updatePostData.content
    }
    // if(updatePostData.authorName) {
    //   currentPost.authorName = updatePostData.authorName
    // }
    return this.postsRepository.save(currentPost)
  }

  async delete (id: number): Promise<void> {
    const currentPost = await this.findById(id)

    await this.postsRepository.remove(currentPost)
  }
}
