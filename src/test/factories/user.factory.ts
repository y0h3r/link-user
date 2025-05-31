import { faker } from '@faker-js/faker';
import { User } from '@users/domain/entities/user.entity';

export function createFakeUserInput(overrides: Partial<any> = {}) {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
    imageUrl: faker.image.avatar(),
    ...overrides,
  };
}

export function createFakeUserEntity(overrides: Partial<User>): User {
  return new User(
    overrides.firstName ?? faker.person.firstName(),
    overrides.lastName ?? faker.person.lastName(),
    overrides.email ?? faker.internet.email(),
    overrides.gender ?? faker.helpers.arrayElement(['MALE', 'FEMALE']),
    overrides.createdAt ?? new Date(),
    overrides.imageUrl ?? faker.image.avatar(),
    overrides.id ?? faker.number.int({ min: 1, max: 1000 }),
  );
}
