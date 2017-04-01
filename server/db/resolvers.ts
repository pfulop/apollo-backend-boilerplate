import * as randomstring from 'randomstring';
import * as jwt from 'jsonwebtoken';
import User from './models/User';
import ModelResolvers from './modelResolvers';
import { SECRET } from '../../secretconfig';

const resolvers = {
  Query: {
    login(_: any, { email, password }: {email: string, password: string}) {
      User.authenticate(email, password).then(user => {
        if (!user) throw new TypeError();
        const token = jwt.sign({ email: user.email, role: user.role }, SECRET, {
          expiresIn: 60 * 60 * 48,
        });
      return({ token: `JWT ${token}` });
    }).catch((err) => {
      throw  new Error('403');
    });
    },
    me(_: any, args : any, { user }: {user: AuthUser}) {
      if (!user) {
        throw new Error('403');
      }
      return User.query().where({ email: user.email }).eager('role').first()
      .then(r => r);
    },
    whoIsIt() {
      return 'Your mom';
    },
  },
  ...ModelResolvers,
  RootMutation: {
    createUser: (_: any, args: {email: string, password: string}) =>
     User.query().insert(args).then(r => r),
    resetPassword: (_: any, email: string) => {
      const tempPassword = randomstring.generate(10);
      return User.query().update({ tempPassword }).where(email).then(r => r);
    },
  },
};

export default resolvers;
