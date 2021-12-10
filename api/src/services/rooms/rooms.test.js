import { rooms, room, deleteRoom } from "./rooms";

describe("rooms", () => {
  scenario("returns all rooms", async (scenario) => {
    const result = await rooms();

    expect(result.length).toEqual(Object.keys(scenario.room).length);
  });

  scenario("returns a single room", async (scenario) => {
    const result = await room({ id: scenario.room.one.id });

    expect(result).toEqual(scenario.room.one);
  });

  scenario("deletes a room", async (scenario) => {
    const original = await deleteRoom({ id: scenario.room.one.id });
    const result = await room({ id: original.id });

    expect(result).toEqual(null);
  });
});
