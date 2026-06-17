function createWebSocketPromise(url) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(url);

        // Resolve only when the I/O connection is fully ready
        ws.onopen = () => {
            console.log('websocket connected successfully');
            resolve(ws);
        }

        // Reject if the connection instantly fails
        ws.onerror = (err) => reject(err);
    });
}


class SocketService {
    constructor(url = 'ws://localhost:3000') {
        this.socket = null;
        this.url = url;
    }

    async connect() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('socket already existed');
            return this.socket;
        }

        try {
            // This properly pauses execution until the handshake completes!
            this.socket = await createWebSocketPromise(this.url);

            // Set up long-term lifecycle event listeners
            this.socket.onclose = () => {
                console.log("Websocket disconnected");
                this.socket = null;
            };
            this.socket.onerror = (error) => console.error("Websocket error:", error);

            return this.socket;
        } catch (error) {
            console.error("Connection failed:", error);
            this.socket = null;
            throw error;
        }
    }

    getSocket() {
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

const socketProvider = new SocketService('ws://localhost:3000');

export default socketProvider;
