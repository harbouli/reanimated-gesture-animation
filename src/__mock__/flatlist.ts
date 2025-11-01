import { faker } from '@faker-js/faker';

faker.seed(30);

export const flatListData = [...Array(100).keys()].map(() => ({
  key: faker.string.uuid(),
  image: faker.image.url({
    width: 300,
    height: 300 * 1.4,
  }),
  bg: faker.color.rgb(),
  title: faker.animal.petName(),
  description: faker.lorem.sentences({ min: 1, max: 3 }),
  author: {
    name: faker.person.fullName(),
    avatar: faker.image.avatarGitHub(),
  },
}));

export type FlatListDataType = (typeof flatListData)[0];
