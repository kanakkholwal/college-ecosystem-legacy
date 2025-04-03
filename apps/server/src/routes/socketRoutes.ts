import type { Server, Socket } from "socket.io";
import { handler_resultScraping } from "../controllers/socket-scraping";

type SocketServer = Record<
  string,
  {
    path: string;
    handler: (io: Server) => (socket: Socket) => void;
  }
>;

const socketServers: SocketServer = {
  result_scraping: {
    path: "/ws/results-scraping",
    handler: handler_resultScraping,
  },
};

export default socketServers;
