import BaseModel from './BaseModel';

export type PlayerJSON = {
  userId: string;
  username: string;
  isReady: boolean;
  isTopBanana: boolean;
  isAdmin: boolean;
  gamesWon: number;
};

export default class Player implements BaseModel<PlayerJSON> {
  private userId: string;
  private username: string;
  private ready = false;
  private topBanana = false;
  private admin: boolean;
  private gamesWon = 0;

  constructor(userId: string, username: string, admin = false) {
    this.userId = userId;
    this.username = username;
    this.admin = admin;
  }

  getUserId(): string {
    return this.userId;
  }

  getUsername(): string {
    return this.username;
  }

  isReady(): boolean {
    return this.ready;
  }

  setReady(ready: boolean): void {
    this.ready = ready;
  }

  isTopBanana(): boolean {
    return this.topBanana;
  }

  setTopBanana(topBanana: boolean): void {
    this.topBanana = topBanana;
  }

  isAdmin(): boolean {
    return this.admin;
  }

  setAdmin(admin: boolean): void {
    this.admin = admin;
  }

  getGamesWon(): number {
    return this.gamesWon;
  }

  incrementGamesWon(): void {
    this.gamesWon++;
  }

  toJSON(): PlayerJSON {
    const { userId, username, ready, topBanana, admin, gamesWon } = this;

    return {
      userId,
      username,
      gamesWon,
      isReady: ready,
      isTopBanana: topBanana,
      isAdmin: admin,
    };
  }

  reset(): void {
    return;
  }
}
