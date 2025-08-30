import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core'
import { UserRole } from '../../users/enum/user-role.enum'
import { roleEnum } from '../enum/user-roles.enum'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  fullName: varchar('name', { length: 100 }),
  role: roleEnum('role').notNull().default(UserRole.USER),
  createdAt: timestamp('created_at').defaultNow(),
  passwordHash: varchar('password_hash', { length: 256 }).notNull(),
  passwordSalt: varchar('password_salt', { length: 256 }).notNull(),
  isBlocked: boolean('is_blocked').notNull().default(false),
})
