import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { LoggerService } from '../logger/logger.service'
import { UserService } from '../users/user.service'
import { CreateNoteDto } from './dto/create-note.dto'
import { Db } from '../db/db.connect'
import { notes } from '../db/schemas/notes.schema'
import { UserMetadata } from '../auth/types/user-metadata.type'
import { asc, desc, eq, sql } from 'drizzle-orm'
import { PaginationQueryDto } from './dto/get-notes-query.dto'

@Injectable()
export class NotesService {
  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
  ) {}

  async getNotes(meta: UserMetadata, query: PaginationQueryDto) {
    let userId: number | undefined = undefined

    if (meta.userRole === 'USER') {
      userId = meta.userId
    }

    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const offset = (page - 1) * limit

    try {
      const [{ value: total }] = await Db.select({
        value: sql<number>`count(*)`,
      })
        .from(notes)
        .where(userId ? eq(notes.ownerId, userId) : undefined)

      const orderBy =
        query.order === 'asc' ? asc(notes.createdAt) : desc(notes.createdAt)

      const data = await Db.select()
        .from(notes)
        .where(userId ? eq(notes.ownerId, userId) : undefined)
        .orderBy(orderBy)
        .limit(Number(limit))
        .offset(Number(offset))

      const totalPages = Math.max(1, Math.ceil((total ?? 0) / limit))

      this.logger.log(`Notes found: ${data.length}`)

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      }
    } catch (e) {
      this.logger.error('Error getting notes', e)
      throw new InternalServerErrorException(
        'Something went wrong, contact tech support',
      )
    }
  }

  async findOrFail(id: number) {
    try {
      const [note] = await Db.select().from(notes).where(eq(notes.id, id))
      if (note) {
        this.logger.log(`Note with id ${id} found`)
        return note
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'Something went wrong, contact tech support',
      )
    }
    this.logger.error(`Note with id ${id} not found`)
    throw new NotFoundException('Note not found')
  }

  async addNote(userId: number, dto: CreateNoteDto) {
    try {
      const user = await this.userService.findByIdSafe(userId)
      const [result] = await Db.insert(notes)
        .values({
          ...dto,
          ownerId: userId,
        })
        .returning()
      this.logger.log(`Note with id ${result.id} created`)
      return result
    } catch (e) {
      this.logger.error('Error adding note', e)
      throw new InternalServerErrorException(
        'Something went wrong, contact tech support',
      )
    }
  }

  async updateNote(
    meta: UserMetadata,
    id: number,
    dto: Partial<CreateNoteDto>,
  ) {
    const note = await this.findOrFail(id)
    if (!this.userService.checkPermission(meta, note.ownerId)) {
      throw new ForbiddenException('You are not allowed to update this note')
    }
    try {
      await Db.update(notes).set(dto).where(eq(notes.id, id))
      return true
    } catch (e) {
      this.logger.error('Error updating note', e)
      throw new InternalServerErrorException(
        'Something went wrong, contact tech support',
      )
    }
  }

  async deleteNote(meta: UserMetadata, id: number) {
    const note = await this.findOrFail(id)
    if (!this.userService.checkPermission(meta, note.ownerId)) {
      throw new ForbiddenException('You are not allowed to delete this note')
    }
    try {
      await Db.delete(notes).where(eq(notes.id, id))
      return true
    } catch (e) {
      this.logger.error('Error deleting note', e)
      throw new InternalServerErrorException()
    }
  }
}
