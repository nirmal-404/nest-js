import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { HelloService } from './hello.service'
import { AnyFilesInterceptor } from '@nestjs/platform-express'

// handles incoming requests and returns responses
// can be used to define routes, middleware, guards, interceptors, etc.

@Controller('hello')
export class HelloController {
  // dependacy injection
  constructor (private readonly helloService: HelloService) {}

  @Get('get-hello')
  getHello (): string {
    return this.helloService.getHello()
  }

  //   http://localhost:3000/hello/greet?name=nirmal
  @Get('greet')
  getHelloWithNameAsQuery (@Query('name') name: string): string {
    return this.helloService.getHelloWithName(name || 'world')
  }

  //   http://localhost:3000/hello/greet/nirmal
  @Get('greet/:name')
  getHelloWithNameAsParams (@Param('name') name: string): string {
    return this.helloService.getHelloWithName(name)
  }

  //   http://localhost:3000/hello/greet   -> raw / x-www-form-urlencoded / form-data    name : Nirmal
  @Post('greet')
  @UseInterceptors(AnyFilesInterceptor())
  greetWith (@Body('name') name: string): string {
    return this.helloService.getHelloWithName(name || 'body')
  }
}
