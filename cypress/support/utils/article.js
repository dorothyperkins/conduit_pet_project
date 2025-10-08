const defaultAuthorDetails = {
  username: 'CyTester',
  bio: null,
  image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
  following: false,
};

export const defaultAuthor = Object.freeze({ ...defaultAuthorDetails });

export const createTimestamps = () => {
  const timestamp = new Date().toISOString();

  return {
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const buildArticleResponse = (article, options = {}) => {
  const {
    author = defaultAuthor,
    timestamps = createTimestamps(),
    overrides = {},
  } = options;

  return {
    article: {
      ...article,
      ...timestamps,
      author,
      favorited: false,
      favoritesCount: 0,
      ...overrides,
    },
  };
};
