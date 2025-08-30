import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { AuthGuard } from '../auth/guards/auth.guard'

@Module({
  imports: [AuthGuard],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
