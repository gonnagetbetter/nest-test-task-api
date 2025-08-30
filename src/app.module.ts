import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './users/user.module'
import { LoggerModule } from './logger/logger.module'
import { NotesModule } from './notes/notes.module'

@Module({
  imports: [LoggerModule, AuthModule, UserModule, NotesModule, NotesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
