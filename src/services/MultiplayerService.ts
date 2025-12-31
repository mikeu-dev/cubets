import * as signalR from '@microsoft/signalr';

// Interface matching Backend C# Model
export interface PlayerState {
    id: number;
    playerId: number;
    x: number;
    y: number;
    lives: number;
    score: number;
    // player object from C# is not fully needed here yet, but can be added if necessary
}

// Interface matching Backend IGameClient interface
export interface IGameClient {
    ReceivePlayerState(state: PlayerState): void;
}

export class MultiplayerService {
    private connection: signalR.HubConnection;
    private stateReceivedCallback: ((state: PlayerState) => void) | null = null;
    public playerId: number;

    constructor() {
        this.playerId = Math.floor(Math.random() * 10000); // Temporary random ID

        // Use relative URL if possible, or fallback to localhost for dev
        const hubUrl = import.meta.env.VITE_GAME_HUB_URL || "http://localhost:5092/gamehub";

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.registerHandlers();
    }

    private registerHandlers() {
        // Type-safe wrapper for "ReceivePlayerState"
        this.connection.on("ReceivePlayerState", (state: PlayerState) => {
            // Ignore our own updates to prevent jitter/loops
            if (state.playerId === this.playerId) return;

            console.log(`[SignalR] Received update from Player ${state.playerId}:`, state);

            if (this.stateReceivedCallback) {
                this.stateReceivedCallback(state);
            }
        });
    }

    public onReceiveState(callback: (state: PlayerState) => void) {
        this.stateReceivedCallback = callback;
    }

    public async connect(): Promise<void> {
        if (this.connection.state === signalR.HubConnectionState.Connected) return;

        try {
            await this.connection.start();
            console.log("SignalR Connected. My PlayerID:", this.playerId);
        } catch (err) {
            console.error("SignalR Connection Error: ", err);
            // Retry handled by withAutomaticReconnect usually, but initial connect needs manual retry often.
            setTimeout(() => this.connect(), 5000);
        }
    }

    public async sendState(state: Partial<PlayerState>): Promise<void> {
        if (this.connection.state !== signalR.HubConnectionState.Connected) return;

        const fullState: PlayerState = {
            id: 0,
            playerId: this.playerId,
            x: state.x || 0,
            y: state.y || 0,
            lives: state.lives || 3,
            score: state.score || 0
        };

        try {
            // "SendPlayerState" matches Hub method name
            await this.connection.invoke("SendPlayerState", fullState);
        } catch (err) {
            console.error("Error sending state: ", err);
        }
    }
}
