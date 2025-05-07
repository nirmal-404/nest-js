import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HelloModule } from 'src/hello/hello.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [HelloModule],
})
export class UserModule {}
