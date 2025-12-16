import * as signalR from '@microsoft/signalr';

export class MultiplayerService {
    private connection: signalR.HubConnection;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5092/gamehub") // Sesuaikan dengan URL backend
            .withAutomaticReconnect()
            .build();
    }

    public async connect(): Promise<void> {
        try {
            await this.connection.start();
            console.log("SignalR Connected.");
        } catch (err) {
            console.error("SignalR Connection Error: ", err);
            // Retry logic could go here
            setTimeout(() => this.connect(), 5000);
        }

        this.connection.on("ReceivePlayerState", (state: any) => {
            console.log("Received state:", state);
            // TODO: Update game state based on received data
        });
    }

    public async sendState(state: any): Promise<void> {
        try {
            await this.connection.invoke("SendPlayerState", state);
        } catch (err) {
            console.error("Error sending state: ", err);
        }
    }
}
