import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'any_secret_string',
      resave: false,
      saveUninitialized: false,
      proxy: true,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    credentials: true,
    exposedHeaders: ['set-cookie'], //---!!! ???
    origin: [
      'http://localhost:8080',
      'https://am-gclient.vercel.app',
      'https://amgclient-production.up.railway.app',
    ],
  });

  const config = new DocumentBuilder()
    .setTitle('AMG automarket-group')
    .setDescription('api documentation')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
