import { Module } from '@nestjs/common'
import { NotesController } from './notes.controller'
import { NotesService } from './notes.service'
import { UserModule } from '../users/user.module'
import { LoggerModule } from '../logger/logger.module'

@Module({
  imports: [LoggerModule, UserModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
