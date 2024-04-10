import {
  Body,
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  LoginCheckResponse,
  LoginUserRequest,
  LoginUserResponse,
  LogoutUserResponse,
  SignupResponse,
} from './types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: SignupResponse })
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  createUser(@Body() createUserDto: CreateUserDto, @Request() { user }) {
    return this.usersService.create(createUserDto, user);
  }

  @ApiBody({ type: LoginUserRequest })
  @ApiOkResponse({ type: LoginUserResponse })
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Header('Content-type', 'application/json')
  login(@Request() req) {
    return {
      user: req.user,
      message: `Успешная авторизация: ${req.user.email}.`,
    };
  }

  @ApiOkResponse({ type: LoginCheckResponse })
  @Get('/login-check')
  @UseGuards(AuthenticatedGuard)
  loginCheck(@Request() req) {
    return req.user;
  }

  @ApiOkResponse({ type: LogoutUserResponse })
  @Get('/logout')
  logout(@Request() req) {
    req.session.destroy();
    return { message: 'Сессия закрыта' };
  }

  @Get('/all-users')
  @UseGuards(AuthenticatedGuard)
  getAllUsers(@Request() req) {
    // if (req.user.role === 'admin') {
    return this.usersService.allUsers();
    // } else {
    //   return { message: 'Доступно только администраторам' };
    // }
  }

  @Post('/verificate-user')
  @UseGuards(AuthenticatedGuard)
  verificateUser(@Request() req, @Body() { id }) {
    if (req.user.role === 'admin') {
      return this.usersService.verificateUser(id);
    } else {
      return { message: 'Доступно только администраторам' };
    }
  }

  @Post('/block-user')
  @UseGuards(AuthenticatedGuard)
  blockUser(@Request() req, @Body() { id }) {
    if (req.user.role === 'admin') {
      return this.usersService.blockUser(id);
    } else {
      return { message: 'Доступно только администраторам' };
    }
  }

  @Post('/update')
  @UseGuards(AuthenticatedGuard)
  updateProfile(
    @Request() { user },
    @Body() { id, name, login }: { id: string; name: string; login: string },
  ) {
    return this.usersService.updateUser(user, id, name, login);
  }

  @Post('/change-pass')
  @UseGuards(AuthenticatedGuard)
  changePassProfile(
    @Request() { user },
    @Body() { id, password }: { id: number; password: string },
  ) {
    return this.usersService.changePassUser(user, id, password);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('delete/:id')
  deleteUser(@Param('id') id: number, @Request() { user }) {
    if (user.role !== 'admin') {
      return { errorMessage: 'Требуются права администратора' };
    }

    return this.usersService.deleteUser(id);
  }
}
