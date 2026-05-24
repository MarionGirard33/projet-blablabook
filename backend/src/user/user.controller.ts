import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserResponseDto } from './dto/update-user.response.dto';
import { UpdateUserRequestDto } from './dto/update-user.request.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('user')
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, type: UpdateUserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  // mise à jour
  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, type: UpdateUserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserRequestDto,
  ) {
    const updatedUser = await this.userService.update(id, body);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  // soft delete
  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete user' })
  @ApiResponse({
    status: 200,
    description: 'User soft deleted successfully',
    type: UpdateUserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    const deletedUser = await this.userService.softDelete(id);
    return {
      message: 'User deleted successfully',
      deletedUser,
    };
  }
}
