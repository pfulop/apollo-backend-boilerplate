import User from './models/User';
import Role from './models/Role';

const typeDefinitions = `

${User.generateGraphSchema}
${Role.generateGraphSchema}

type Query {
  login(email: String, password: String): String
  whoIsIt: String
  me: User
}

type RootMutation {
  createUser(
    email: String!
    password: String!
  ): User
  resetPassword(email: String): String


}

schema {
  query: Query
  mutation: RootMutation
}
`;

export default [typeDefinitions];
