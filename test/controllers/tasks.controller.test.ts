import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../app.testing';

describe('#tasks', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
  });

  it('get tasks list', async () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(HttpStatus.OK);
  });

  it('create task', async () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'New task', description: 'this is new task' })
      .expect(HttpStatus.CREATED);
  });

  it('get nonexistent task', async () => {
    const wrongId = '0';
    return request(app.getHttpServer())
      .get(`/tasks/${wrongId}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('create task with invalid data', async () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: '', description: '' })
      .expect(HttpStatus.BAD_REQUEST);
  });

  afterEach(async () => {
    await app.close();
  });
});
