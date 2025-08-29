import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { notes } from '../schemas/notes.schema'

export type SelectNote = InferSelectModel<typeof notes>
export type InsertNote = InferInsertModel<typeof notes>
