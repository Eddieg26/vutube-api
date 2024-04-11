export class Session {
  id: string;
  userId: string;
  expiresAt: Date;

  constructor(id: string, userId: string, expiresAt: Date) {
    this.id = id;
    this.userId = userId;
    this.expiresAt = expiresAt;
  }

  data() {
    return {
      id: this.id,
      userId: this.userId,
      expiresAt: this.expiresAt.toISOString(),
    };
  }
}
