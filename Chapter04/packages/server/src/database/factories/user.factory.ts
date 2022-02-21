import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../../entity/User';

define(User, (faker: typeof Faker) => {
  const user = new User()
  user.fullName = faker.name.findName();
  user.bio = faker.lorem.sentences();
  user.email = faker.internet.email();
  user.username = faker.internet.userName();
  user.password = faker.internet.password();
  user.image = faker.image.imageUrl();
  user.coverImage = faker.image.imageUrl();
  user.postsCount = 200;
  user.createdAt = faker.date.past();

  return user;
});


