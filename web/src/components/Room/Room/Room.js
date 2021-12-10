import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { Link, routes, navigate } from "@redwoodjs/router";

const DELETE_ROOM_MUTATION = gql`
  mutation DeleteRoomMutation($id: Int!) {
    deleteRoom(id: $id) {
      id
    }
  }
`;

const jsonDisplay = (obj) => {
  return (
    <pre>
      <code>{JSON.stringify(obj, null, 2)}</code>
    </pre>
  );
};

const timeTag = (datetime) => {
  return (
    <time dateTime={datetime} title={datetime}>
      {new Date(datetime).toUTCString()}
    </time>
  );
};

const checkboxInputTag = (checked) => {
  return <input type="checkbox" checked={checked} disabled />;
};

const Room = ({ room }) => {
  const [deleteRoom] = useMutation(DELETE_ROOM_MUTATION, {
    onCompleted: () => {
      toast.success("Room deleted");
      navigate(routes.rooms());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id) => {
    if (confirm("Are you sure you want to delete room " + id + "?")) {
      deleteRoom({ variables: { id } });
    }
  };

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Room {room.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{room.id}</td>
            </tr>
            <tr>
              <th>Video url</th>
              <td>{room.videoUrl}</td>
            </tr>
            <tr>
              <th>Current time</th>
              <td>{room.currentTime}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(room.createdAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editRoom({ id: room.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(room.id)}
        >
          Delete
        </button>
      </nav>
    </>
  );
};

export default Room;
