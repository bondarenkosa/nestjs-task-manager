import * as path from 'path';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';
import { createConnection, getConnection, getRepository, getConnectionManager } from 'typeorm';

const getDefaultConnection = async () => {
  const connectionManager = getConnectionManager();
  return connectionManager.has('default') ? connectionManager.get('default') : await createConnection();
};

export const loadFixtures = async () => {
  const connection = await getDefaultConnection();

  await connection.synchronize(true);

  const loader = new Loader();
  loader.load(path.resolve(__dirname, './fixtures'));

  const resolver = new Resolver();
  const fixtures = resolver.resolve(loader.fixtureConfigs);
  const builder = new Builder(connection, new Parser());

  for (const fixture of fixturesIterator(fixtures)) {
    const entity = await builder.build(fixture);
    const repository = getRepository(entity.constructor.name);
    await repository.save(entity);
  }
};

export const clearDatabase = async (): Promise<void> => {
  const connection = await getDefaultConnection();
  await connection.dropDatabase();
};
