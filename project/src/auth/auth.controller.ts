import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { Roles } from './decorators/roles.decorators'
import { UserRole } from './entities/user.entity'
import { RolesGuard } from './guards/roles-guard'
import { LoginThrottlerGuard } from './guards/login-throttler.guard'

@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService) {}

  @Post('register')
  register (@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @UseGuards(LoginThrottlerGuard)
  @Post('login')
  login (@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('refresh')
  refreshToken (@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken)
  }

  //protected route
  // Current user route
  //Current user route

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile (@CurrentUser() user: any) {
    return user
  }

  //protected route
  //user role is an admin user
  //create admin route

  @Post('create-admin')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createAdmin (@Body() registerDto: RegisterDto) {
    return this.authService.createAdmin(registerDto)
  }
}
