const typeDefs = `#graphql

  type User {
    id: Int!
    name: String!
    email: String!
    createdAt: String
    updatedAt: String
    publishedAt: String
    profile: Profile
    posts: [Post]
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
    published: String
    publishedAt: String
    createdAt: String
    updatedAt: String
  }


  type Query {
    users: [User!]
    user(id: Int!): User

    profiles: [Profile!]
    profile(id: Int!): Profile

    posts: [Post!]
    post(id: Int!): Post
    myPosts: postResponse
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!, bio: String): authResponse,
    signin(email: String!, password: String!): authResponse,

    addPost(post: postPayload!): addPostResponse,
    updatePost(postId: Int!, post: postPayload!): addPostResponse,
    updatePostStatus(postId: Int!, published: String!): addPostResponse,
    deletePost(postId: Int!): addPostResponse,
  }


   type authResponse {
    token: String
    message: String
    success: Boolean
  }
  
  type addPostResponse {
    data: Post
    message: String
    success: Boolean
  }

  type postResponse {
    data: [Post]
    message: String
    success: Boolean
  }

  input postPayload {
    title: String, 
    content: String
  }
`;

export default typeDefs;
