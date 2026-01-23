import { Server as HttpServer } from 'http';
import Logger from '../core/logger';
import { Server as IOServer, Socket } from 'socket.io';

type MessageType =
    | 'REGISTER_PC'
    | 'REGISTER_ADMIN'
    | 'COMMAND'
    | 'MONEY_IN'
    | 'PC_UPDATE'
    | 'PC_ACTIVE_FOR_COIN'
    | 'NEW_TRANSACTION'
    | 'COIN_TIMEOUT';

interface BaseMessage<T = any> {
    type: MessageType;
    payload?: T;
}

interface RegisterPcPayload {
    pcId: number;
}

interface CommandPayload {
    command: string;
    payload?: any;
}

type ExtSocket = Socket & { pcId?: number; isAdmin?: boolean };

class WebSocketService {
    public io: IOServer | null = null;
    public pcConnections: Map<number, ExtSocket> = new Map();
    public adminConnections: Set<ExtSocket> = new Set();

    init(server: HttpServer) {
        this.io = new IOServer(server, { path: '/ws/v1' });

        this.io.on('connection', (socket: ExtSocket) => {
            Logger.log().info('New Socket.IO connection');

            socket.on('message', (message: any) => {
                try {
                    const data = typeof message === 'string' ? JSON.parse(message) : message;
                    this.handleMessage(socket, data);
                } catch (e) {
                    console.error('Invalid JSON Socket message', e);
                }
            });

            socket.on('disconnect', () => {
                this.handleDisconnect(socket);
            });
        });
    }

    handleMessage(socket: ExtSocket, data: BaseMessage) {
        switch (data.type) {
            case 'REGISTER_PC': {
                const payload = data.payload as RegisterPcPayload | undefined;
                if (payload && payload.pcId) {
                    this.pcConnections.set(payload.pcId, socket);
                    socket.pcId = payload.pcId;
                    Logger.log().info(`PC ${payload.pcId} connected to Socket.IO`);
                }
                break;
            }
            case 'REGISTER_ADMIN': {
                this.adminConnections.add(socket);
                socket.isAdmin = true;
                Logger.log().info('Admin connected to Socket.IO');
                break;
            }
            default:
                Logger.log().warn(`Unknown Socket message type: ${data.type}`);
        }
    }

    handleDisconnect(socket: ExtSocket) {
        if (socket.pcId) {
            this.pcConnections.delete(socket.pcId);
            Logger.log().info(`PC ${socket.pcId} disconnected`);
        } else if (socket.isAdmin) {
            this.adminConnections.delete(socket);
        }
    }

    sendToPc<T>(pcId: number, type: MessageType, payload?: T): boolean {
        const socket = this.pcConnections.get(pcId);
        if (socket && socket.connected) {
            socket.emit('message', { type, payload });
            return true;
        }
        return false;
    }

    broadcastToAdmins<T>(type: MessageType, payload?: T) {
        this.adminConnections.forEach((socket) => {
            if (socket.connected) {
                socket.emit('message', { type, payload });
            }
        });
    }
}

export default new WebSocketService();
