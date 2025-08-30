import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { Db } from '../db/db.connect'
import { users } from '../db/schemas/user.schema'
import { and, eq, ilike, type SQLWrapper } from 'drizzle-orm'
import { InsertUser, SelectUser, UpdateUser } from '../db/types/user.type'
import { LoggerService } from '../logger/logger.service'
import { UserMetadata } from '../auth/types/user-metadata.type'
import { UserRole } from './enum/user-role.enum'
import { BlockUserDto } from './dto/block-user.dto'
import { FindUsersDto } from './dto/find-users.dto'
import { SetUserRoleDto } from './dto/set-user-role.dto'

@Injectable()
export class UserService {
  constructor(private readonly logger: LoggerService) {}

  async findByEmail(email: string): Promise<SelectUser | null> {
    try {
      const [user] = await Db.select().from(users).where(eq(users.email, email))

      if (user) {
        this.logger.log(`User with e-mail ${email} info was found in database`)

        return user as SelectUser
      }
    } catch (e) {
      this.logger.error('Error finding user by email', e)

      throw new HttpException(e, 503)
    }
    return null
  }

  async create(
    userData: Omit<InsertUser, 'id' | 'createdAt'>,
  ): Promise<InsertUser> {
    try {
      const [user] = await Db.insert(users).values(userData).returning()

      this.logger.log(
        `User with e-mail ${userData.email} created with id ${user.id}`,
      )

      return user
    } catch (e) {
      this.logger.error('Error creating user', e)

      throw new InternalServerErrorException(
        'Something went wrong, contact tech support',
      )
    }
  }

  async findByIdSafe(id: number): Promise<Partial<SelectUser> | null> {
    try {
      const [user] = await Db.select({
        email: users.email,
        fullName: users.fullName,
      })
        .from(users)
        .where(eq(users.id, id))

      if (user) {
        this.logger.log(`User with id ${id} info was found in database`)
        return user
      }
    } catch (e) {
      this.logger.error('Error finding user by id', e)

      throw new HttpException(e, 504)
    }

    this.logger.log(`User with id ${id} does not exist`)
    throw new BadRequestException(`User with id ${id} does not exist`)
  }

  async update(
    meta: UserMetadata,
    id: number,
    userData: Partial<UpdateUser>,
  ): Promise<boolean> {
    const user = await this.findByIdSafe(id)

    if (!this.checkPermission(meta, id)) {
      throw new ForbiddenException('You are not allowed to update this user')
    }

    try {
      await Db.update(users).set(userData).where(eq(users.id, id))
      this.logger.log(`User with id ${id} info was updated`)
      return true
    } catch (e) {
      this.logger.error('Error updating user', e)
      return false
    }
  }

  async block(id: number, dto: BlockUserDto): Promise<boolean> {
    const user = await this.findByIdSafe(id)

    try {
      await Db.update(users)
        .set({
          isBlocked: dto.isBlocked,
        })
        .where(eq(users.id, id))

      this.logger.log(`User with id ${id} info was blocked`)
      return true
    } catch (e) {
      this.logger.error('Error updating user', e)
      throw new InternalServerErrorException(
        'Something went wrong, contact tech support',
      )
    }
  }

  async delete(meta: UserMetadata, id: number): Promise<boolean> {
    if (!this.checkPermission(meta, id)) {
      throw new ForbiddenException('You are not allowed to delete this user')
    }

    const user = await this.findByIdSafe(id)

    try {
      await Db.delete(users).where(eq(users.id, id))
      return true
    } catch (e) {
      this.logger.error('Error deleting user', e)
      throw new InternalServerErrorException(
        'Something went wrong, contact tech support',
      )
    }
  }

  async findAll(
    filters: FindUsersDto,
  ): Promise<Omit<SelectUser, 'passwordHash' | 'passwordSalt'>[]> {
    const whereClauses: SQLWrapper[] = []

    if (filters.name?.trim()) {
      whereClauses.push(ilike(users.fullName, `%${filters.name.trim()}%`))
    }

    if (typeof filters.blocked === 'boolean') {
      whereClauses.push(eq(users.isBlocked, filters.blocked))
    }

    const where = whereClauses.length ? and(...whereClauses) : undefined

    try {
      this.logger.log(`Searching for users with filters: ${filters}`)
      const result = await Db.select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
        isBlocked: users.isBlocked,
        createdAt: users.createdAt,
      })
        .from(users)
        .where(where)
        .orderBy(users.id)
      if (result.length !== 0) {
        return result
      }
    } catch (e) {
      this.logger.error('Error finding users', e)
      throw new InternalServerErrorException(
        'Something went wrong, contact tech support',
      )
    }

    this.logger.log('No users found')
    throw new BadRequestException('No users found')
  }

  async setRole(id: number, dto: SetUserRoleDto): Promise<boolean> {
    const user = await this.findByIdSafe(id)

    try {
      await Db.update(users)
        .set({
          role: dto.role,
        })
        .where(eq(users.id, id))
      return true
    } catch (e) {
      this.logger.error('Error updating user', e)
      throw new InternalServerErrorException(
        'Something went wrong, contact tech support',
      )
    }
  }

  checkPermission(meta: UserMetadata, id: number): boolean {
    if (meta.userId === id) return true
    return meta.userRole === UserRole.ADMIN
  }
}
