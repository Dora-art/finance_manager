import { DataSourceOptions } from 'typeorm';

const { DataSource, DataSourceOptions } = require('typeorm');

require('dotenv').config();
for (const envName of Object.keys(process.env)) {
  process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
}

export const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    'dist/**/*.entity.js',
    'dist/**/entities/*.entity.js',
    'src/**/entities/*.entity.js',
    './build/src/entity/*.js',
  ],
  migrations: ['dist/src/migrations/*.js'],
};

export const dataSourceOption = new DataSource(config);

dataSourceOption
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
