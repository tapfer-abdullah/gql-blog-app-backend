const typeDefs = `#graphql

  type User {
    id: Int!
    name: String!
    email: String!
    createdAt: String
    updatedAt: String
    publishedAt: String
    profile: Profile
  }

  type Profile {
    id: Int!
    bio: String
    createdAt: String
    updatedAt: String
    userId: Int!
    user: User
  }

  type Post {
    id: Int!
    title: String!
    content: String
    authorId: Int!
    author: User
    published: Boolean
    publishedAt: String
    createdAt: String
    updatedAt: String
  }

  type authResponse {
    token: String
    message: String
    success: Boolean
  }

  type Query {
    users: [User!]
    user(id: Int!): User

    profiles: [Profile!]
    profile(id: Int!): Profile

    posts: [Post!]
    post(id: Int!): Post
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!, bio: String): authResponse,
    signin(email: String!, password: String!): authResponse,
  }
`;

export default typeDefs;
