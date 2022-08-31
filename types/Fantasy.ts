export type GameState = {
    playerData: Array<PlayerData>;
    currentGameweek: number;
    fantasyTeams: Array<FantasyTeam>;
    activePlayers: Players;
    messages: string[];
};

export interface Players {
    [key: string]: Player;
}

export interface Player {
    element: number; // id
    position: number;
    name: string;
    currentScore: number;
    events: Event[];
    totalScore?: number;
    penaltySave?: number;
    penaltyMiss?: number;
    minutesPlayed?: number;
    messagesSent: number;
}

export interface Event {
    name: string;
    points: number;
    value: number;
    stat: string;
}

export interface PlayerElements {
    [key: string]: PlayerElement;
}

export interface PlayerElement {
    explain: Array<Array<Array<Event> | number>>;
    stats: Stats;
}

export interface Stats {
    minutes: number;
    goals_scored: number;
    assists: number;
    clean_sheets: number;
    goals_conceded: number;
    own_goals: number;
    penalties_saved: number;
    penalties_missed: number;
    yellow_cards: number;
    red_cards: number;
    saves: number;
    bonus: number;
    bps: number;
    influence: number;
    creativity: number;
    threat: number;
    ict_index: number;
    total_points: number;
    in_dreamteam: boolean;
}

export type FantasyTeam = {
    id: number;
    name: string;
    currentGameweekTeam: Array<Player>;
    gameweekScore?: number;
    totalScore?: number;
};

export type PlayerData = {
    id: number;
    second_name: string;
};

export interface Bootstrap {
    elements: Array<PlayerData>;
    events: {
        current: number;
    };
}

export interface LeagueDetails {
    league_entries: Array<{
        entry_id: number;
        entry_name: string;
    }>;
}

export interface GameweekStats {
    picks: Array<Player>;
}

export interface PlayerDetails {
    history: Array<{
        total_points: number;
        penalties_saved: number;
        penalties_missed: number;
        minutes: number;
    }>;
}

export interface GameweekScore {
    entry: {
        event_points: number;
        overall_points: number;
    };
}
