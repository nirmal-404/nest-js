import { Injectable } from '@nestjs/common'
import { HelloService } from 'src/hello/hello.service'

@Injectable()
export class UserService {
  // Injecting HelloService into UserService
  // hello module exports HelloService
  // user module imports hello module

  constructor (private readonly helloService: HelloService) {}

  getAllUsers () {
    return [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
      { id: 3, name: 'Alice Johnson' },
      { id: 4, name: 'Bob Brown' },
      { id: 5, name: 'Charlie Davis' },
    ]
  }

  getUserById (id: number) {
    return this.getAllUsers().find(user => user.id == id)
  }

  getWelcomeMessage (userID:number) {
    const user = this.getUserById(userID)
    if (!user) {
      return 'User not found'
    }
    return this.helloService.getHelloWithName(user?.name)
  }
}
