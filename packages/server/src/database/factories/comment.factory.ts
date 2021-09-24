import Faker from 'faker';
import { define, factory } from 'typeorm-seeding';
import { Comment } from '../../entity/Comment';

define(Comment, (faker: typeof Faker) => {
  const comment = new Comment();
  comment.comment = faker.lorem.text();
  comment.createdAt = faker.date.past();
  return comment;
});
