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
    credential: admin.credential.cert({
      projectId: 'puregram-2ade0',
      privateKey:
        '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCpDvU5V6Ac04Og\n20Yk+KadVu4EbZrNQZyL4HYP/t/hpUtLvi94iMRJpMxPnGCFKckOzJMc9BbVmLX1\nboAGOKYkliesSWz4R4/OusMKcbQ8fCfy7sZdol4nifGPDC4c58HkUvjKoGwbLHOQ\nCzfQZe40GGJGTkwzgsLyBXbL7DMaAd76l2YMQ1dx/Wu9TFE5bHDpko7pbODYOOe5\nZs+G4CGDBOAqsyFB8aaoGwZr4Y96xL6fRsRnp0G2gjJ/u/MaemlxmmEuv8wJTNQm\nYVrJRjd0Tm7oxSI09XYTNCXVtw3hlthorfauDmp+qhzgEWT+UGImEU5sItoV6oi3\n1bGNuBdZAgMBAAECggEAReHff0kX7+KFBjCt4amBIgflkqIF+/OztORfmUQXoowz\nwEcJE2+hh/md1QjEozb/G+V3qF/Dsp6SFLaNKEUxdG03UBH3//eA3Ak6h24x/VCr\nKNIH4Hu2JOzyE9oKk7s/XFTp78R5e5AX4wKoGzaPTSyJLxu9hwt17xpQHYJxKz3P\nZVruh+VkovjayDW8G9iD48f2/Q60HJltmtVs9+IlKFtJGz026aErFL0TO2p3dLxJ\nAeqgEJnvocPiY45Cd3ntB31vrDuwPef41V3HrpwJOWuXwG9iws/i4WD+wHov3Umh\nZ4NZI4bWv5ROW744HE7+s4hKFxtNQhUZDTRWr00HewKBgQDeELMb+i1Q4WlKEyQV\nXu+639RwhKezz9oLG4vT9nzWtJijYjz1e5PMxN2gLM8KT0w47QXi/lP3tAMkT4YW\nmsFIfXfS/U/YBUvQ74kUaWapu2RScEEdNQkJ96gAiT5v9wudiFswqwDniFHfurS3\nLJAXfm0GVXiKZF2h08QpngsNswKBgQDC5JsxAbScq+cgcyPl5uhieuVhT+578MFO\n1X7eKamkEuzMNQ97tSEf6pSzo/ANoLn4JU7thiDbpfV70iGl4avigCwINRm1sq+0\nQzuBwhVCKEg+bHTZyeDxlWiajpGDjSzTGN0meguCpYBGBz6oiCtR7lJXVjdcQ00F\nG8fmLry4wwKBgQDV7ER/KSzKg7vIblQOelx7K/EdS826fPtSRAEZ+pQcyfFZQ+Px\noFCrrOLL0R7KkcWd+Uf4eoUtVK7KJgnIcODOEoCCMyDdu4xkBL2LelY6IJnuiNFR\nb6v7fCbODWimt9jqs1cVtUazxTEKVHSPGVDeMR6aQXBT8Yf5w2Vvqh5/3QKBgFNJ\nbMThrLSzhd9JNVMffbnwOSyAAzO2LHYrKL96YIO8jrOqDUbZniFMl2W5rnG0eSUB\nlJxPEKWtY54Zq8V/DnyKN8b+IlGS3iGUBc8rCPivzEfZA4q7CkVTi1NZj/f/EePY\noVG7IEYhwhKrL+zH3HNz/H5UWu4z2KtRNvk4ifAPAoGAcBxvs/uExrfq2u1ARefe\ndWQ8VVCoa/6L6GhalO+EDjOtgGnOAbI95rTDL1oVr6nqjnIL8R+SVEpPdS8mQpBY\nSJHsOa8UnbkGR/lvKUmWLyOG4sGryVOQSheG6gWqej37Yoh3Gj+gEaL5itCo0wVz\nKLGQr8XgbzTyXcsO3Tz7BRY=\n-----END PRIVATE KEY-----\n',
      clientEmail:
        'firebase-adminsdk-2ql8z@puregram-2ade0.iam.gserviceaccount.com',
    }),
    storageBucket: 'gs://puregram-2ade0.appspot.com',
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
