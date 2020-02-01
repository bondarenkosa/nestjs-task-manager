import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../app.testing';
import { loadFixtures, clearDatabase } from '../fixtures.loader';
import { Repository, getRepository } from 'typeorm';
import { Task } from '../../src/tasks/task.entity';
import { TaskStatus } from '../../src/tasks/task-status.enum';

describe('#tasks', () => {
  let app: INestApplication;
  let taskRepository: Repository<Task>;

  beforeAll(async () => {
    app = await createTestingApp();
    taskRepository = getRepository(Task);
  });

  beforeEach(async () => {
    await loadFixtures();
  });

  describe('authenticated', () => {
    const authCredentials = {
      username: 'user1',
      password: 'Password123',
    };

    const taskId = 1;

    let jwtToken: string;

    beforeEach(async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(authCredentials);

      jwtToken = loginResponse.body.accessToken;
    });

    it('get tasks list', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.OK);
    });

    it('get task by id', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.OK);
    });

    it('create task', async () => {
      const newTaskData = {
        title: 'New task',
        description: 'this is new task',
      };
      const tasksCountBefore = await taskRepository.count();

      await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(newTaskData)
        .expect(HttpStatus.CREATED);

      const tasksCountAfter = await taskRepository.count();
      expect(tasksCountAfter).toBe(tasksCountBefore + 1);
    });

    it('update task status', async () => {
      const newStatus: TaskStatus = TaskStatus.IN_PROGRESS;

      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ status: newStatus })
        .expect(HttpStatus.OK);

      const task = await taskRepository.findOne(taskId);
      expect(task.status).toBe(newStatus);
    });

    it('delete task', async () => {
      const tasksCountBefore = await taskRepository.count();

      await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.OK);

      const tasksCountAfter = await taskRepository.count();
      expect(tasksCountAfter).toBe(tasksCountBefore - 1);
    });

    it('can\'t get nonexistent task', () => {
      const wrongId = '0';

      return request(app.getHttpServer())
        .get(`/tasks/${wrongId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('can\'t create task with invalid data', () => {
      const invalidData = {
        title: '',
        description: '',
      };

      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(invalidData)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('authenticated as another user', () => {
    const authCredentials = {
      username: 'user2',
      password: 'Password123',
    };

    const anotherUserTaskId = 1;

    let jwtToken: string;

    beforeEach(async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(authCredentials);

      jwtToken = loginResponse.body.accessToken;
    });

    it('cannot get another user\'s task', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${anotherUserTaskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('cannot delete another user\'s tasks', async () => {
      const tasksCountBefore = await taskRepository.count();

      await request(app.getHttpServer())
        .delete(`/tasks/${anotherUserTaskId}`)
        .set('Authorization', `Bearer ${jwtToken}`);

      const tasksCountAfter = await taskRepository.count();
      expect(tasksCountAfter).toBe(tasksCountBefore);
    });
  });

  describe('unauthenticated', () => {
    it('can\'t get tasks without auth', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await app.close();
  });
});
