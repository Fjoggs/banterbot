import { GameState, PlayerElements, Event } from '../../types/Fantasy';

export const checkForNewEvents = (state: GameState, incomingElements: PlayerElements) => {
    for (const elementId in incomingElements) {
        if (Object.prototype.hasOwnProperty.call(incomingElements, elementId)) {
            const playerElement = incomingElements[elementId];
            const incomingEvents = playerElement.explain[0][0] as Event[];
            if (state.activePlayers[elementId]) {
                const currentEvents = state.activePlayers[elementId].events;
                if (incomingEvents.length > currentEvents.length) {
                    const diff = incomingEvents.length - currentEvents.length;
                    let newEvents: Event[] = [];
                    for (let i = diff; i > 0; i--) {
                        const event = incomingEvents[i];
                        newEvents.push(event);
                    }
                }
            } else {
                console.log('oops');
            }
        }
    }
    return state;
};

export const getMessages = (state: GameState, events): Array<String> => {
    if (events?.length > 1) {
        events.forEach((event: { stat: string; playerName: any }) => {
            if (event.stat === 'penalties_saved') {
                state.messages.push(`${event.playerName} redda akkurat straffe!`);
            } else if (event.stat === 'goals_scored') {
                state.messages.push(`Golazo ${event.playerName}`);
            } else if (event.stat === 'red_cards') {
                state.messages.push(`Off you pop ${event.playerName}`);
            } else if (event.stat === 'penalties_missed') {
                state.messages.push(`${event.playerName} pls`);
            }
        });
    }
    return state.messages;
};
