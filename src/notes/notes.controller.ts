import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger'
import { AuthGuard } from '../auth/guards/auth.guard'
import { NotesService } from './notes.service'
import { UserMeta } from '../auth/decorator/user-meta.decorator'
import { UserMetadata } from '../auth/types/user-metadata.type'
import { CreateNoteDto, CreateNoteSchema } from './dto/create-note.dto'
import {
  PaginationQueryDto,
  PaginationQuerySchema,
} from './dto/get-notes-query.dto'
import { SelectNote } from '../db/types/notes.type'
import { ZodValidationPipe } from 'nestjs-zod'

@UseGuards(AuthGuard)
@Controller('notes')
@ApiTags('notes')
@ApiBearerAuth()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(PaginationQuerySchema))
  @ApiOperation({ summary: 'Get notes with pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Returns a list of notes' })
  getNotes(@UserMeta() meta: UserMetadata, @Query() query: PaginationQueryDto) {
    return this.notesService.getNotes(meta, query)
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateNoteSchema))
  @ApiOperation({ summary: 'Create a new note' })
  @ApiBody({ type: CreateNoteDto, description: 'Note data' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  async addNote(
    @UserMeta() meta: UserMetadata,
    @Body() dto: CreateNoteDto,
  ): Promise<Partial<SelectNote>> {
    return this.notesService.addNote(meta.userId, dto)
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(CreateNoteSchema.partial()))
  @ApiOperation({ summary: 'Update a note' })
  @ApiParam({ name: 'id', description: 'Note ID', type: 'number' })
  @ApiBody({ description: 'Note data to update' })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  async updateNote(
    @UserMeta() meta: UserMetadata,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateNoteDto>,
  ) {
    return this.notesService.updateNote(meta, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({ name: 'id', description: 'Note ID to delete', type: 'number' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  async deleteNote(
    @UserMeta() meta: UserMetadata,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notesService.deleteNote(meta, id)
  }
}
