import {eq, or} from 'drizzle-orm';
import {User, usersTable} from '../../models';
import {Database} from '../../services';
import {first} from 'radash';

export async function findUserById(database: Database, id: string) {
  const result = await database
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id));

  return first(result);
}

export async function findUserByUsername(database: Database, username: string) {
  const result = await database
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));

  return first(result);
}

export async function findUserByEmail(database: Database, email: string) {
  const result = await database
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return first(result);
}

export async function findUser(database: Database, identifier: string) {
  const result = await database
    .selectDistinct()
    .from(usersTable)
    .where(
      or(eq(usersTable.username, identifier), eq(usersTable.email, identifier))
    );

  return first(result);
}

export async function createUser(database: Database, user: User) {
  const result = await database.insert(usersTable).values(user).returning();

  return first(result);
}
