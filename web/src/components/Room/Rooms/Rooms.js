import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { Link, routes } from "@redwoodjs/router";

import { QUERY } from "src/components/Room/RoomsCell";

const DELETE_ROOM_MUTATION = gql`
  mutation DeleteRoomMutation($id: Int!) {
    deleteRoom(id: $id) {
      id
    }
  }
`;

const MAX_STRING_LENGTH = 150;

const truncate = (text) => {
  let output = text;
  if (text && text.length > MAX_STRING_LENGTH) {
    output = output.substring(0, MAX_STRING_LENGTH) + "...";
  }
  return output;
};

const jsonTruncate = (obj) => {
  return truncate(JSON.stringify(obj, null, 2));
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

const RoomsList = ({ rooms }) => {
  const [deleteRoom] = useMutation(DELETE_ROOM_MUTATION, {
    onCompleted: () => {
      toast.success("Room deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  });

  const onDeleteClick = (id) => {
    if (confirm("Are you sure you want to delete room " + id + "?")) {
      deleteRoom({ variables: { id } });
    }
  };

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Video url</th>
            <th>Current time</th>
            <th>Created at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{truncate(room.id)}</td>
              <td>{truncate(room.videoUrl)}</td>
              <td>{truncate(room.currentTime)}</td>
              <td>{timeTag(room.createdAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.room({ id: room.id })}
                    title={"Show room " + room.id + " detail"}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editRoom({ id: room.id })}
                    title={"Edit room " + room.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={"Delete room " + room.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(room.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomsList;
