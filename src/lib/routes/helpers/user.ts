import { eq } from 'drizzle-orm';
import { first } from 'radash';
import { User, usersTable } from '../../models';
import { Database } from '../../services';

export async function findUserById(database: Database, id: string) {
  const result = await database
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id));

  return first(result);
}

export async function findUserByEmail(database: Database, email: string) {
  const result = await database
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return first(result);
}

export async function insertUser(database: Database, user: User) {
  const result = await database.insert(usersTable).values(user).returning();

  return first(result);
}
