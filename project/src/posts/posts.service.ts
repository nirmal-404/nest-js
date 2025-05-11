import {
  ForbiddenException,
  Inject,
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
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { FindPostsQueryDto } from './dto/find-posts-query.dto'
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface'

@Injectable()
export class PostsService {
  private postListCacheKeys: Set<string> = new Set()
  constructor (
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  private generatePostsListCacheKey (query: FindPostsQueryDto): string {
    const { page = 1, limit = 10, title } = query
    return `posts_list_page${page}_limit${limit}_title${title || 'all'}`
  }

  async findAll (query: FindPostsQueryDto): Promise<PaginatedResponse<Post>> {
    const cacheKey = this.generatePostsListCacheKey(query)

    this.postListCacheKeys.add(cacheKey)

    const getCachedData = await this.cacheManager.get<PaginatedResponse<Post>>(
      cacheKey,
    )

    if (getCachedData) {
      console.log(
        `Cache Hit --------> Returning posts list from Cache ${cacheKey}`,
      )
      return getCachedData
    }
    console.log(`Cache Miss --------> Returning posts list from database`)

    const { page = 1, limit = 10, title } = query

    const skip = (page - 1) * limit

    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.authorName', 'authorName')
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit)

    if (title) {
      queryBuilder.andWhere('post.title ILIKE :title', { title: `%${title}%` })
    }
    const [items, totalItems] = await queryBuilder.getManyAndCount()

    const totalPages = Math.ceil(totalItems / limit)

    const paginatedResponse = {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    }

    await this.cacheManager.set(cacheKey, paginatedResponse, 30000)

    return paginatedResponse
  }

  async findById (id: number): Promise<Post> {
    const cacheKey = `post_${id}`
    const cachedPost = await this.cacheManager.get<Post>(cacheKey)

    if (cachedPost) {
      console.log(`Cache Hit --------> Returning post from Cache ${cacheKey}`)
      return cachedPost
    }

    console.log(`Cache miss ---------> Returning post from DB`)

    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['authorName'],
    })

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`)
    }

    await this.cacheManager.set(cacheKey, post, 30000)

    return post
  }

  async create (createPostData: CreatePostDto, authorName: User): Promise<Post> {
    const newlyCreatedPost = this.postsRepository.create({
      title: createPostData.title,
      content: createPostData.content,
      authorName,
    })
    //Invalidate the existing cache
    await this.invalidateAllExistingListCaches()

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

    const updatedPost = await this.postsRepository.save(currentPost)

    await this.cacheManager.del(`post_${id}`)

    await this.invalidateAllExistingListCaches()

    return updatedPost
  }

  async delete (id: number): Promise<void> {
    const currentPost = await this.findById(id)

    await this.postsRepository.remove(currentPost)

    await this.cacheManager.del(`post_${id}`);

    await this.invalidateAllExistingListCaches();
  }

  private async invalidateAllExistingListCaches (): Promise<void> {
    console.log(
      `Invalidating ${this.postListCacheKeys.size} list cache entries`,
    )

    for (const key of this.postListCacheKeys) {
      await this.cacheManager.del(key)
    }

    this.postListCacheKeys.clear()
  }

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

  // private getNextId (): number {
  //   return this.posts.length > 0
  //     ? Math.max(...this.posts.map(post => post.id)) + 1
  //     : 1
  // }

  // async findall (query: FindPostsQueryDto): Promise<any> {
  //   const posts = await this.postsRepository.find({
  //     relations: ['authorName'],
  //   })

  //   return posts.map(post => {
  //     const safeAuthor = {
  //       id: post.authorName.id,
  //       name: post.authorName.name,
  //       role: post.authorName.role,
  //     }
  //     const { authorName, ...rest } = post
  //     return {
  //       ...rest,
  //       authorName: safeAuthor,
  //     }
  //   })
  // }
}
