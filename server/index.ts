import * as compression from 'compression';
import * as express from 'express';
import {Express} from 'express';
import * as morgan from 'morgan';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as jwt from 'express-jwt';
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express';
import {makeExecutableSchema} from 'graphql-tools';
import typeDefs from './db/schema';
import resolvers from './db/resolvers';
import {knex} from './db/connectors'; // eslint-disable-line
import {SECRET} from '../secretconfig';
import {TOKEN} from '../config';

const DEBUG = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;
const server = express();

server.use(cookieParser());
const Schema = makeExecutableSchema({typeDefs, resolvers});

server.use(bodyParser.urlencoded({extended: true}),);
server.use(bodyParser.json());

server.use(compression());
server.use(morgan(DEBUG
  ? 'dev'
  : 'combined'));

server.use('/', jwt({
  secret: SECRET,
  credentialsRequired: false,
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      return req
        .headers
        .authorization
        .split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    } else if (req.cookies && req.cookies[TOKEN]) {
      return req
        .cookies[TOKEN]
        .split(' ')[1];
    }
    return null;
  }
}));

server.use('/graphql', graphqlExpress((req, res) => {
  if (!req || !res) 
    return {schema: Schema};
  const query = req.query.query || req.body.query;
  if (query && query.length > 2000) {
    // limiter
    throw new Error('Query too large.');
  }
  let user;
  if (req.user) {
    user = {
      email: req.user.email,
      role: req.user.role,
      id: req.user.id
    };
  }
  return {
    schema: Schema,
    context: {
      user
    },
    formatError: (err : Error) => {
      if (err.message && err.message.indexOf('Unauthorized') > -1) {
        res.status(401);
      }
      if (err.message && err.message.indexOf('Not Found') > -1) {
        res.status(404);
      }
      return err;
    }
  };
}),);

if (DEBUG) {
  server.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}),);
} else {
  server.use(express.static(path.resolve(__dirname, '../build')));
}

server.set('trust proxy', true);
server.set('trust proxy', 'loopback');

server.listen(PORT, () => console.info(`Server running in ${server.get('env')} on port ${PORT}`),
);
// check mongodb server webpack flightplan typescript