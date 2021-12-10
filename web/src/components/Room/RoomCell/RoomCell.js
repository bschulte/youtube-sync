import Room from "src/components/Room/Room";

export const QUERY = gql`
  query FindRoomById($id: Int!) {
    room: room(id: $id) {
      id
      videoUrl
      currentTime
      createdAt
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Room not found</div>;

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error.message}</div>
);

export const Success = ({ room }) => {
  return <Room room={room} />;
};
