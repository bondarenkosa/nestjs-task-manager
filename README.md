# Simple task manager

[![Maintainability](https://api.codeclimate.com/v1/badges/d31ef948e8987441e324/maintainability)](https://codeclimate.com/github/bondarenkosa/nestjs-task-manager/maintainability)
[![CI badge](https://github.com/bondarenkosa/nestjs-task-manager/workflows/Node.js%20CI/badge.svg)](https://github.com/bondarenkosa/nestjs-task-manager/actions?query=workflow%3A%22Node.js+CI%22)

This is a simple pet-project to learn the _NestJS_ and _Typescript_.

## Demo

### Web Api

[https://nestjs-task-manager.herokuapp.com/tasks](https://nestjs-task-manager.herokuapp.com/tasks)

### Usage

Create new user:

```console
$ curl -X POST https://nestjs-task-manager.herokuapp.com/auth/signup -d "username=test1&password=Password1"
```

Login:

```console
$ curl -X POST https://nestjs-task-manager.herokuapp.com/auth/signin -d "username=test1&password=Password1"
```

Copy your access token:

```console
$ export JWT_TOKEN="<your-jwt-token>"
```

Create a task using the token:

```console
$ curl -X POST https://nestjs-task-manager.herokuapp.com/tasks \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title": "New task", "description": "task description"}'
```

Take a list of tasks:

```console
$ curl https://nestjs-task-manager.herokuapp.com/tasks -H "Authorization: Bearer $JWT_TOKEN"
```

Also you can delete task or update task status. See more in controllers.

## Install

These instructions will get you a copy of the project up and running on your local machine.

```console
$ make install
```

Manually create a **.env** file:

```console
$ cp -n .env.example .env
```

Run:

```console
$ make start
```
