import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { JwtDto } from './dto/jwt.dto'
import { SignUpDto, SignUpSchema } from './dto/sign-up.dto'
import { AuthService } from './auth.service'
import { SignUpResultDto } from './dto/sign-up-result.dto'
import { SignInDto, SignInSchema } from './dto/sign-in.dto'
import { ZodValidationPipe } from 'nestjs-zod'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signUp')
  @UsePipes(new ZodValidationPipe(SignUpSchema))
  signUp(@Body() dto: SignUpDto): Promise<SignUpResultDto> {
    return this.authService.signUp(dto)
  }

  @Post('signIn')
  @UsePipes(new ZodValidationPipe(SignInSchema))
  signIn(@Body() dto: SignInDto): Promise<JwtDto> {
    return this.authService.signIn(dto)
  }
}
