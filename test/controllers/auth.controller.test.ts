import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../app.testing';
import { loadFixtures, clearDatabase } from '../fixtures.loader';
import { Repository, getRepository } from 'typeorm';
import { User } from '../../src/auth/user.entity';

describe('#tasks', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  const authCredentials = {
    username: 'user1',
    password: 'Password123',
  };

  beforeAll(async () => {
    app = await createTestingApp();
    userRepository = getRepository(User);
  });

  beforeEach(async () => {
    await loadFixtures();
  });

  it('successful sign up', async () => {
    const newAuthCredentials = {
      username: 'newuser',
      password: 'NewPassword123',
    };
    const usersCountBefore = await userRepository.count();

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(newAuthCredentials);

    const usersCountAfter = await userRepository.count();
    expect(usersCountAfter).toBe(usersCountBefore + 1);
  });

  it('unsuccessful sign up', async () => {
    const newAuthCredentials = {
      username: 'newuser',
      password: 'pass',
    };
    const usersCountBefore = await userRepository.count();

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(newAuthCredentials)
      .expect(HttpStatus.BAD_REQUEST);

    const usersCountAfter = await userRepository.count();
    expect(usersCountAfter).toBe(usersCountBefore);
  });

  it('successful sign in', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(authCredentials);

    expect(res.body).toHaveProperty('accessToken');
  });

  it('unsuccessful sign in', async () => {
    const wrongCredentials = {
      ...authCredentials,
      password: 'wrong password',
    };

    const res = await request(app.getHttpServer())
    .post('/auth/signin')
    .send(wrongCredentials)
    .expect(HttpStatus.UNAUTHORIZED);
  });

  it('cannot register an existing user', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(authCredentials)
      .expect(HttpStatus.BAD_REQUEST);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await app.close();
  });
});
