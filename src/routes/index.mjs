//router
import authRouter from './authRouter.mjs';
import userRouter from './userRouter.mjs';
import fingerPrintRouter from './fingerPrintRouter.mjs';
import keyRouter from './keyRouter.mjs';
import imageHistoryRouter from './imageHistoryRouter.mjs';
import historyRouter from './historyRouter.mjs';
//swagger
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
//------------------------------------------------------------

const options = {
    definition: {
      failOnErrors: true,
      openapi: '3.0.0',
      info: {
        title: 'SmartDoor API',
        description: 'API documentation for SmartDoor application',
        version: '1.1.0',
      },
    },
    apis: ['./src/routes/*.mjs'], // files containing annotations as above
  };
  
  const openapiSpecification = swaggerJSDoc(options);

function routes(app) {
    app.use(
        '/api/v1/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(openapiSpecification)
      );
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/fingerprint', fingerPrintRouter);
    app.use('/api/v1/key', keyRouter);
    app.use('/api/v1/image-history', imageHistoryRouter);
    app.use('/api/v1/history', historyRouter);
}

export default routes;
