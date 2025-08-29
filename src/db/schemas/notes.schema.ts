import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core'
import { users } from './user.schema'

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  title: varchar('heading', { length: 100 }),
  text: varchar('text', { length: 1000 }),
  createdAt: timestamp('created_at').defaultNow(),
  ownerId: integer('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})
