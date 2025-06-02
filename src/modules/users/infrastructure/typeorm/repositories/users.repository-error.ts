import { BaseError } from '@common/errors/base.error';
import { HttpStatus } from '@nestjs/common';

export class UserNotFoundError extends BaseError {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}

export class SaveUserError extends BaseError {
  constructor(error?: Error) {
    super('Error saving user', HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
}

export class UpdateUserError extends BaseError {
  constructor(error?: Error) {
    super('Error updating user', HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
}

export class FindUsersError extends BaseError {
  constructor(error?: Error) {
    super('Error finding users', HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
}

export class FindUserError extends BaseError {
  constructor(error?: Error) {
    super('Error finding user', HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
}
