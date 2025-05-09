import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common'
import { PostsService } from '../posts.service'

@Injectable()
export class PostExistsPipe implements PipeTransform {
  constructor (private readonly postsService: PostsService) {}

  transform (value: any, metadata: ArgumentMetadata) {
    try {
      this.postsService.findById(value)
    } catch (error) {
      throw new NotFoundException(`Post with ID ${value} not found`)
    }
    return value
  }
}
