import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from './config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { cleanupOpenApiDoc } from 'nestjs-zod'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest Test Task API')
    .setDescription('API documentation for Nest Test Task')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const rawDocument = SwaggerModule.createDocument(app, swaggerConfig)

  const document = cleanupOpenApiDoc(rawDocument)

  SwaggerModule.setup('api/docs', app, document)

  await app.listen(config.port)
}

bootstrap().catch(err => {
  console.error('Error during bootstrap:', err)
  process.exit(1)
})
