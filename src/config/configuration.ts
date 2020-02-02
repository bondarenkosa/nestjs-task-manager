export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  typeOrm: {
    type: process.env.TYPEORM_CONNECTION || 'postgres',
    host: process.env.TYPEORM_HOST || 'localhost',
    port: parseInt(process.env.TYPEORM_PORT, 10) || 5432,
    database: process.env.TYPEORM_DATABASE || 'db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
  },
  jwt: {
    expiresIn: process.env.JWT_EXPIRES_IN || 3600,
    secret: process.env.JWT_SECRET,
  },
});
