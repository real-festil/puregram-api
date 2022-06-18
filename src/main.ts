import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { Storage } from 'firebase-admin/storage';
import admin from 'firebase-admin';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initializeApp({
    credential: applicationDefault(),
    storageBucket: 'gs://smartreader-339508.appspot.com',
  });

  app.setGlobalPrefix('api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(
    morgan(function (tokens, req, res) {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');
    }),
  );

  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('SmartReader')
    .setDescription('The SmartReader API description')
    .setVersion('1.0')
    .addTag('SmartReader')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Creates a client from a Google service account key
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // The ID of your GCS bucket

  async function createBucket() {
    // Creates the new bucket
    const bucket = admin.storage().bucket();
    console.log(`Bucket ${bucket} created.`);
  }

  createBucket().catch(console.error);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
