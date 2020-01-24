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

  afterEach(async () => {
    await app.close();
  });
});
