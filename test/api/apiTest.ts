import { checkForEvents, checkForEvents2, checkForEventsWithState, GameState, getMessages, getMessagesWithState, getState, Player } from "../../api/api";

describe("api", () => {
  it.only('checkForEvents adds events to queue if eventlist is longer than current amount of events', () => {
    const players = new Set<Player>();
    const player: Player = {
      element: 1,
      position: 9,
      name: "Jenny",
      currentScore: 0,
      events: [],
      messagesSent: 0
    };
    players.add(player);
    const state = {
      activePlayers: players,
    };

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
    checkForEventsWithState(data, state);
    const actual = getState()
    player.events = [
      {
        stat: "goals_scored",
        points: 4,
        value: 1
      }
    ]
    players.delete(player);
    players.add(player)
    const expected = {
      activePlayers: players,
    }
    expect(actual).toEqual(expected);
  })

  it('checkForEvents does not add events to queue if eventlist is equal or fewer than current amount of events', () => {
    const players = new Set<Player>();
    const player: Player = {
      element: 1,
      position: 9,
      name: "Jenny",
      currentScore: 0,
      events: 2,
    };
    players.add(player);
    const state = {
      activePlayers: players,
    };
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
    const actual = checkForEventsWithState(data, state);
    expect(actual).toEqual([]);
  })

  it('checkForEvents adds 1 event to queue if eventlist is equal or fewer than current amount of events', () => {
    const players = new Set<Player>();
    const player: Player = {
      element: 1,
      position: 9,
      name: "Jenny",
      currentScore: 0,
      events: 2,
    };
    players.add(player);
    const state = {
      activePlayers: players,
    };
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
    const expected = [
      {
        element: 1,
        playerName: 'Jenny',
        stat: "goals_scored",
        points: 4,
        value: 1
      },
      {
        element: 1,
        playerName: 'Jenny',
        stat: "goals_scored",
        points: 4,
        value: 1
      }
    ];
    const actual = checkForEventsWithState(data, state);
    expect(actual).toEqual(expected);
  })


  it('getMessages', () => {
    const players = new Set<Player>();
    const player: Player = {
      element: 1,
      position: 9,
      name: "Jenny",
      currentScore: 0,
      events: 2,
    };
    players.add(player);
    const state = {
      activePlayers: players,
      messages: []
    };
    const data = [
      {
        element: 1,
        playerName: 'Jenny',
        stat: 'goals_scored',
        points: 4,
        value: 1
      },
      {
        element: 1,
        playerName: 'Jenny',
        stat: 'goals_scored',
        points: 4,
        value: 1
      }

    ]
    const actual = getMessagesWithState(data, state)
    const expected = ['Golazo Jenny']
    expect(actual).toEqual(expected)
  })

  xit("checkForEvents", () => {
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
    const actual = checkForEvents(data);
    const expected = [];
    expect(actual).toEqual(expected);
  });

  xit("new one", () => {
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
    const actual = checkForEvents(data);
    const expected = ["Golazo jenny"];
    expect(actual).toEqual(expected);
  });

  xit("new one 2", () => {
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
    const actual = checkForEvents(data);
    const expected = ["Golazo jenny", "Golazo jenny"];
    expect(actual).toEqual(expected);
  });
});
