import _ from "lodash";
import { LowSync, MemorySync } from "lowdb";
import { JSONFileSync } from "lowdb/node";

export interface Room {
  roomId: string;
  roomName: string;
}

export interface Payload {
  role: string;
}

export interface Message {
  roomId: string;
  messageId: string;
  messageText: string;
}

export interface User {
  username: string;
  password: string;
  role: "ADMIN" | "SUPER_ADMIN";
  studentId: string;
}

export const originalDB = {
  rooms: [
    {
      roomId: "okhkUzffzCGMqtfC1uv6x",
      roomName: "CPE & ISNE Chitchat",
    },
    {
      roomId: "HhVrDzdfsW-dS0YGOzrV3",
      roomName: "261207 Tutorial",
    },
  ],
  messages: [
    {
      roomId: "okhkUzffzCGMqtfC1uv6x",
      messageId: "Yi4K5qb-K8iMTgq_zwo0_",
      messageText: "Hi bro!",
    },
    {
      roomId: "okhkUzffzCGMqtfC1uv6x",
      messageId: "f8rM7yKv7FRLokgwU7wfg",
      messageText: "Hi everyone",
    },
    {
      roomId: "HhVrDzdfsW-dS0YGOzrV3",
      messageId: "mBE0AghdK3uwb_yvX9n35",
      messageText: "Can anyone teach me RESTFul API?",
    },
  ],
  users: [
    { username: "user1", password: "1234", role: "ADMIN" },
    { username: "user2", password: "5678", role: "SUPER_ADMIN" },
  ],
};

const onProduction = process.env.NODE_ENV === "production";

const adapter = onProduction
  ? new MemorySync()
  : new JSONFileSync("DatabaseFile.json");
let lowDB = new LowSync(adapter, originalDB);
export let DB = onProduction ? _.cloneDeep(originalDB) : lowDB.data;

export function resetDB() {
  if (onProduction) {
    DB = _.cloneDeep(originalDB);
  } else {
    lowDB = new LowSync(adapter, originalDB);
    DB = lowDB.data;
    lowDB.write();
  }
}

export function readDB() {
  if (!onProduction) {
    lowDB.read();
    DB = lowDB.data;
  }
}

export function writeDB() {
  if (!onProduction) {
    lowDB.write();
  }
}
