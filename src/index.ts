import config from 'config';
import { urlencoded, json} from 'body-parser';
import express, {
  Express,
  Request,
  Response
} from 'express';

import { RegisterRoutes } from './routes';
import * as swaggerJson from './swagger.json';
import * as swaggerUI from 'swagger-ui-express';

import logger from './utils/Logger'

const app: Express = express();
const port: Number = config.get('app.port');
let log = logger.child({ example: "child-example" });

app.use(urlencoded({ extended: true }));
app.use(json());
RegisterRoutes(app);
app.use(['/openapi', '/docs', '/swagger'], swaggerUI.serve, swaggerUI.setup(swaggerJson));

app.get('/scenario', (req: Request, res: Response) => {
  log = log.child({ child: 'child-example-2'})
  log.info(req.headers);
  res.send('TypeScript nodejs template');
});

app.listen(port, () => {
  log.info('Server is running');
});

