import { Module } from '@nestjs/common';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

@Module({
  controllers: [HelloController],
  providers: [HelloService],
  imports: [], // import other modules if needed
  exports: [HelloService], // export services if needed to use in other modules
})
export class HelloModule {}
