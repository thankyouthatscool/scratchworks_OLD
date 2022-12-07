import { User } from "@scratchworks/scratchworks-backend";

export type LocalUser = Omit<User, "password">;

export type AppState = {
  loading: boolean;
  user: LocalUser | null;
};
