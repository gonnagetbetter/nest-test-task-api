import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { UserService } from './user.service'
import { AuthGuard } from '../auth/guards/auth.guard'
import { UserMeta } from '../auth/decorator/user-meta.decorator'
import { SelectUser, UpdateUser } from '../db/types/user.type'
import { UserMetadata } from '../auth/types/user-metadata.type'
import { RolesGuard } from '../auth/guards/roles.guard'
import { UserRole } from './enum/user-role.enum'
import { RequiredRole } from '../auth/decorator/required-role.decorator'
import { BlockUserDto } from './dto/block-user.dto'
import { FindUsersDto, FindUsersSchema } from './dto/find-users.dto'
import { SetUserRoleDto, SetUserRoleSchema } from './dto/set-user-role.dto'
import { ZodValidationPipe } from 'nestjs-zod'
import { UpdateUserSchema } from './dto/update-user.dto'

@Controller('users')
@UseGuards(AuthGuard)
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'Returns the current user information' })
  getMe(@UserMeta() meta: UserMetadata): Promise<Partial<SelectUser> | null> {
    return this.userService.findByIdSafe(meta.userId)
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateUserSchema))
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiBody({ description: 'User data to update' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: Boolean })
  update(
    @UserMeta() meta: UserMetadata,
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: Partial<UpdateUser>,
  ): Promise<boolean> {
    return this.userService.update(meta, id, userData)
  }

  @Patch('block/:id')
  @UseGuards(RolesGuard)
  @RequiredRole(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(UpdateUserSchema))
  @ApiOperation({ summary: 'Block a user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID to block', type: 'number' })
  @ApiBody({ type: BlockUserDto, description: 'Block user data' })
  @ApiResponse({ status: 200, description: 'User blocked successfully', type: Boolean })
  block(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: BlockUserDto,
  ): Promise<boolean> {
    return this.userService.block(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID to delete', type: 'number' })
  @ApiResponse({ status: 200, description: 'User deleted successfully', type: Boolean })
  delete(
    @UserMeta() meta: UserMetadata,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return this.userService.delete(meta, id)
  }

  @Get()
  @UseGuards(RolesGuard)
  @RequiredRole(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(FindUsersSchema))
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by name' })
  @ApiQuery({ name: 'blocked', required: false, description: 'Filter by blocked status' })
  @ApiResponse({ status: 200, description: 'Returns a list of users' })
  getUsers(
    @Query() query: FindUsersDto,
  ): Promise<Omit<SelectUser, 'passwordHash' | 'passwordSalt'>[]> {
    return this.userService.findAll(query)
  }

  @Patch('role/:id')
  @UseGuards(RolesGuard)
  @UsePipes(new ZodValidationPipe(SetUserRoleSchema))
  @RequiredRole(UserRole.ADMIN)
  @ApiOperation({ summary: 'Change user role (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiBody({ type: SetUserRoleDto, description: 'New role data' })
  @ApiResponse({ status: 200, description: 'Role changed successfully', type: Boolean })
  changeRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SetUserRoleDto,
  ): Promise<boolean> {
    return this.userService.setRole(id, dto)
  }
}
