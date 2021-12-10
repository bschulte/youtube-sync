import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { navigate, routes } from "@redwoodjs/router";

import RoomForm from "src/components/Room/RoomForm";

export const QUERY = gql`
  query EditRoomById($id: Int!) {
    room: room(id: $id) {
      id
      videoUrl
      currentTime
      createdAt
    }
  }
`;
const UPDATE_ROOM_MUTATION = gql`
  mutation UpdateRoomMutation($id: Int!, $input: UpdateRoomInput!) {
    updateRoom(id: $id, input: $input) {
      id
      videoUrl
      currentTime
      createdAt
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error.message}</div>
);

export const Success = ({ room }) => {
  const [updateRoom, { loading, error }] = useMutation(UPDATE_ROOM_MUTATION, {
    onCompleted: () => {
      toast.success("Room updated");
      navigate(routes.rooms());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSave = (input, id) => {
    updateRoom({ variables: { id, input } });
  };

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Room {room.id}</h2>
      </header>
      <div className="rw-segment-main">
        <RoomForm room={room} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  );
};
