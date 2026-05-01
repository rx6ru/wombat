import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { generateOpenApiDocument } from '../openapi/index.js';

const router = Router();
const openApiDocument = generateOpenApiDocument();

router.get('/openapi.json', (_req, res) => {
  res.json(openApiDocument);
});

router.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      validatorUrl: null,
    },
    customSiteTitle: 'Wombat Backend API Docs',
  }),
);

export default router;
