import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor (private readonly userService : UserService) {}

    // http://localhost:3000/user
    @Get()
    getAllUsers () {
        return this.userService.getAllUsers()
    }
    

    // http://localhost:3000/user/welcome/1
    @Get('welcome/:id')
    getWelcomeMessage (@Param('id') id: number) : string {
        console.log(id)
        return this.userService.getWelcomeMessage(id)
    }

    @Get('welcome')
    getWelcomeMsg(@Query('id') id: number): string {
        console.log("here")
        return this.userService.getWelcomeMessage(id)
    }

    // http://localhost:3000/user/1
    @Get(':id')
    getUserById (@Param('id') id: number) : any {
        return this.userService.getUserById(id)
    }
}
