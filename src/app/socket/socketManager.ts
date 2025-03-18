/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as IOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import handleChat from './handleChat';
import { User } from '../modules/user/user.model';
import AppError from '../error/appError';
import httpStatus from 'http-status';
let io: IOServer;
export const onlineUser = new Set();
const initializeSocket = (server: HTTPServer) => {
  if (!io) {
    io = new IOServer(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
      },
    });
    // online user

    console.log(onlineUser);
    // io.on('ping', (data) => {
    //   io.emit('pong', data);
    // });
    io.on('connection', async (socket: Socket) => {
      const userId = socket.handshake.query.id as string;
      if (!userId) {
        return;
      }

      const currentUser = await User.findById(userId);
      if (!currentUser) {
        return;
      }
      const currentUserId = currentUser?._id.toString();
      // create a room-------------------------
      socket.join(currentUserId as string);
      // set online user
      onlineUser.add(currentUserId);
      // send to the client
      io.emit('onlineUser', Array.from(onlineUser));

      // handle chat -------------------
      await handleChat(io, socket, currentUserId);

      socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        onlineUser.delete(currentUserId);
        io.emit('onlineUser', Array.from(onlineUser));
      });
    });
  }
  return io;
};

const getIO = () => {
  if (!io) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Socket.io is not initialized. Call initializeSocket first.',
    );
  }
  return io;
};

export { initializeSocket, getIO };
