import { Injectable, NotFoundException } from '@nestjs/common'
import { Posts } from './interfaces/post.interface'

@Injectable()
export class PostsService {
  private posts: Posts[] = [
    {
      id: 1,
      title: 'Post 1',
      content: 'Content of post 1',
      authorName: 'Author 1',
      createdAt: new Date(),
    },
    {
      id: 2,
      title: 'Post 2',
      content: 'Content of post 2',
      authorName: 'Author 2',
      createdAt: new Date(),
    },
    {
      id: 3,
      title: 'Post 3',
      content: 'Content of post 3',
      authorName: 'Author 3',
      createdAt: new Date(),
    },
  ]

  private getNextId (): number {
    return this.posts.length > 0
      ? Math.max(...this.posts.map(post => post.id)) + 1
      : 1
  }

  findall (): Posts[] {
    return this.posts
  }

  findById (id: number): Posts {
    const post = this.posts.find(post => post.id === id)

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`)
    }
    return post
  }

  create (createPostData: Omit<Posts, 'id' | 'createdAt'>): Posts {
    const newPost: Posts = {
      id: this.getNextId(),
      ...createPostData,
      createdAt: new Date(),
    }

    this.posts.push(newPost)
    return newPost
  }

  update (
    id: number,
    updatePostData: Partial<Omit<Posts, 'id' | 'createdAt'>>,
  ): Posts {
    const currentPostIndex = this.posts.findIndex(post => post.id === id)
    if (currentPostIndex === -1) {
      throw new NotFoundException(`Post with id ${id} not found`)
    }

    this.posts[currentPostIndex] = {
      ...this.posts[currentPostIndex],
      ...updatePostData,
      updatedAt: new Date(),
    }
    return this.posts[currentPostIndex]
  }

  delete (id: number): { message: string } {
    const currentPostIndex = this.posts.findIndex(post => post.id === id)
    if (currentPostIndex === -1) {
      throw new NotFoundException(`Post with id ${id} not found`)
    }

    this.posts.splice(currentPostIndex, 1)

    return {
      message: `Post with id ${id} deleted successfully`,
    }
  }
}
