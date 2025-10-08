const articleForDeletion = {
  title: 'This is the title articles for deleting',
  description: 'This is a description',
  body: 'This is a body of the article',
  slug: 'this-is-the-title-articles-for-deleting',
  tagList: ['testing'],
};

describe('Article deletion', () => {
  beforeEach(() => {
    cy.intercept('GET', `${Cypress.env('apiUrl')}/api/tags`, {
      fixture: 'tags.json',
    }).as('getTags');

    cy.loginToApplication();
    cy.wait('@getTags');
  });

  it('creates and deletes an article using the API', () => {
    const timestamps = {
      createdAt: '2024-01-27T21:52:32.682Z',
      updatedAt: '2024-01-27T21:52:32.682Z',
    };

    const articleResponse = {
      article: {
        ...articleForDeletion,
        ...timestamps,
        author: {
          username: 'CyTester',
          bio: null,
          image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
          following: false,
        },
        favorited: false,
        favoritesCount: 0,
      },
    };

    cy.intercept('POST', `${Cypress.env('apiUrl')}/api/articles`, (req) => {
      expect(req.body.article).to.deep.include({
        title: articleForDeletion.title,
        description: articleForDeletion.description,
        body: articleForDeletion.body,
      });

      req.reply({
        statusCode: 201,
        body: articleResponse,
      });
    }).as('postArticle');

    cy.intercept(
      'GET',
      `${Cypress.env('apiUrl')}/api/articles/${articleForDeletion.slug}`,
      {
        statusCode: 200,
        body: articleResponse,
      },
    ).as('getCreatedArticle');

    cy.intercept(
      'DELETE',
      `${Cypress.env('apiUrl')}/api/articles/${articleForDeletion.slug}`,
      {
        statusCode: 204,
      },
    ).as('deleteArticle');

    cy.intercept(
      'GET',
      `${Cypress.env('apiUrl')}/api/articles?limit=10&offset=0`,
      {
        statusCode: 200,
        body: {
          articles: [],
          articlesCount: 0,
        },
      },
    ).as('articlesAfterDelete');

    cy.contains('New Article').click();

    cy.get('[formcontrolname="title"]').type(articleForDeletion.title);
    cy.get('[formcontrolname="description"]').type(articleForDeletion.description);
    cy.get('[formcontrolname="body"]').type(articleForDeletion.body);
    cy.contains('Publish Article').click();

    cy.wait('@postArticle').its('response.statusCode').should('eq', 201);
    cy.wait('@getCreatedArticle');

    cy.contains('Delete Article').click();

    cy.wait('@deleteArticle').its('response.statusCode').should('eq', 204);
    cy.wait('@articlesAfterDelete');

    cy.get('app-article-list').should('not.contain', articleForDeletion.title);
  });
});
