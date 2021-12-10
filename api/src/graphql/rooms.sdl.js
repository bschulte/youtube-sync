export const schema = gql`
  type Room {
    id: Int!
    videoUrl: String
    currentTime: String
    createdAt: DateTime!
  }

  type Query {
    rooms: [Room!]! @requireAuth
    room(id: Int!): Room @requireAuth
  }

  input CreateRoomInput {
    videoUrl: String
    currentTime: String
  }

  input UpdateRoomInput {
    videoUrl: String
    currentTime: Float
  }

  type Mutation {
    createRoom(input: CreateRoomInput!): Room! @requireAuth
    updateRoom(id: Int!, input: UpdateRoomInput!): Room! @requireAuth
    deleteRoom(id: Int!): Room! @requireAuth
  }
`
