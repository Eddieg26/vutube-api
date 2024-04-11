import {first} from 'radash';
import {Video, videosTable} from '../../models/video';
import {Database} from '../../services';

export async function insertVideo(database: Database, video: Video) {
  const result = await database.insert(videosTable).values(video).returning();

  return first(result);
}
