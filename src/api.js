import "dotenv";
import { GraphQLHTTP } from "gql";
import { makeExecutableSchema } from "graphql_tools";
import { gql } from "graphql_tag";

const typeDefs = gql`
  type Query {
    hello : String
  }
`;

const resolvers = {
  Query: {
    hello: () => Promise.resolve("Hello World!"),
  },
};

/**
 * @param {Request} req
 * @returns {Response}
 */
export const graphql = async (req) =>
  await GraphQLHTTP({
    schema: makeExecutableSchema({ resolvers, typeDefs }),
    graphiql: true,
  })(req);
