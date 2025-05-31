import { BaseError } from '@common/errors/base.error';
import { HttpStatus } from '@nestjs/common';

export class UserFriendSaveError extends BaseError {
  constructor(error?: Error) {
    super(
      'Failed to create friend link between users',
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}

export class UserFriendNotFoundAfterSaveError extends BaseError {
  constructor() {
    super(
      'Friend link was saved but could not be reloaded with relations',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class SelfFriendshipNotAllowedError extends BaseError {
  constructor() {
    super('A user cannot add themselves as a friend', HttpStatus.BAD_REQUEST);
  }
}
