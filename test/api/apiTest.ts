import { checkForEvents, Player } from "../../api/api";

const players = new Set<Player>();
const player: Player = {
  element: 1,
  position: 9,
  name: "jenny",
  currentScore: 0,
  events: 2,
};
players.add(player);
const state = {
  activePlayers: players,
};

describe("api", () => {
  it("checkForEvents", () => {
    const data = {
      elements: {
        1: {
          explain: [
            [
              [
                {
                  name: "Goals scored",
                  points: 4,
                  value: 1,
                  stat: "goals_scored",
                },
                {
                  name: "Minutes played",
                  points: 0,
                  value: 0,
                  stat: "minutes",
                },
              ],
              69,
            ],
          ],
        },
      },
    };
    const actual = checkForEvents(data, state);
    const expected = [];
    expect(actual).toEqual(expected);
  });

  it("new one", () => {
    const data = {
      elements: {
        1: {
          explain: [
            [
              [
                {
                  name: "Minutes played",
                  points: 0,
                  value: 0,
                  stat: "minutes",
                },
                {
                  name: "Goals scored",
                  points: 4,
                  value: 1,
                  stat: "goals_scored",
                },
                {
                  name: "Goals scored",
                  points: 4,
                  value: 1,
                  stat: "goals_scored",
                },
              ],
              69,
            ],
          ],
        },
      },
    };
    const actual = checkForEvents(data, state);
    const expected = ["Golazo jenny"];
    expect(actual).toEqual(expected);
  });

  it("new one 2", () => {
    const data = {
      elements: {
        1: {
          explain: [
            [
              [
                {
                  name: "Minutes played",
                  points: 0,
                  value: 0,
                  stat: "minutes",
                },
                {
                  name: "Goals scored",
                  points: 4,
                  value: 1,
                  stat: "goals_scored",
                },
                {
                  name: "Goals scored",
                  points: 4,
                  value: 1,
                  stat: "goals_scored",
                },
              ],
              69,
            ],
          ],
        },
      },
    };
    const actual = checkForEvents(data, state);
    const expected = ["Golazo jenny", "Golazo jenny"];
    expect(actual).toEqual(expected);
  });
});
