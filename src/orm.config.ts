import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  // url: process.env.DATABASE_URL,
  // type: 'postgres',
  // ssl: {
  //   rejectUnauthorized: false,
  // },
  // port: 5432,
  // username: 'vwjyxdrolyetry',
  // password: '49cccd08371b8fbc11a416511d50646430f76c7e3abe35fbf3e67c4c1bf9afd9',
  // host: 'ec2-54-157-16-196.compute-1.amazonaws.com',
  // database: 'd489asb45b9phf',
  // type: 'postgres',
  // synchronize: true,
  // entities: ['dist/**/*.entity{.ts,.js}'],
  port: 3306,
  username: 'root',
  password: 'root',
  host: 'localhost',
  database: 'puregram_db',
  type: 'mysql',
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
};
