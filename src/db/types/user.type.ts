import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { users } from '../schemas/user.schema'

export type SelectUser = InferSelectModel<typeof users>
export type InsertUser = InferInsertModel<typeof users>
export type UpdateUser = Partial<
  Omit<
    InsertUser,
    'id' | 'createdAt' | 'isBlocked' | 'passwordHash' | 'passwordSalt' | 'role'
  >
>
