import * as signalR from '@microsoft/signalr';

export interface PlayerState {
    id: number; // Database ID (optional)
    playerId: number; // Session/Random ID
    x: number;
    y: number;
    lives: number;
    score: number;
}

export class MultiplayerService {
    private connection: signalR.HubConnection;
    private stateReceivedCallback: ((state: PlayerState) => void) | null = null;
    public playerId: number;

    constructor() {
        this.playerId = Math.floor(Math.random() * 10000); // Temporary random ID
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5092/gamehub")
            .withAutomaticReconnect()
            .build();
    }

    public onReceiveState(callback: (state: PlayerState) => void) {
        this.stateReceivedCallback = callback;
    }

    public async connect(): Promise<void> {
        try {
            await this.connection.start();
            console.log("SignalR Connected. My PlayerID:", this.playerId);
        } catch (err) {
            console.error("SignalR Connection Error: ", err);
            setTimeout(() => this.connect(), 5000);
        }

        this.connection.on("ReceivePlayerState", (state: PlayerState) => {
            // Ignore our own updates
            if (state.playerId === this.playerId) return;

            if (this.stateReceivedCallback) {
                this.stateReceivedCallback(state);
            }
        });
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
            await this.connection.invoke("SendPlayerState", fullState);
        } catch (err) {
            console.error("Error sending state: ", err);
        }
    }
}
