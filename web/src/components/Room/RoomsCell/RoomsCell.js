import { Link, routes } from "@redwoodjs/router";

import Rooms from "src/components/Room/Rooms";

export const QUERY = gql`
  query FindRooms {
    rooms {
      id
      videoUrl
      currentTime
      createdAt
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {"No rooms yet. "}
      <Link to={routes.newRoom()} className="rw-link">
        {"Create one?"}
      </Link>
    </div>
  );
};

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error.message}</div>
);

export const Success = ({ rooms }) => {
  return <Rooms rooms={rooms} />;
};
