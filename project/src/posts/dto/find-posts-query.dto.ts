import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class FindPostsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MaxLength(100, { message: `Title search cann't exceed 100 chracters` })
  title?: string;
}
