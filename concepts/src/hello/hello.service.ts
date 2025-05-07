import { Injectable } from '@nestjs/common'

// This service is used to handle business logic and data access
// It can be used to define services, repositories, etc.

@Injectable()
export class HelloService {
  getHello (): string {
    return 'Hello NEST JS!'
  }

  getHelloWithName (name: string): string {
    return `Hello ${name}! 
        Welcome to NEST JS!`
  }
}
