const article = {
  title: 'This is the title',
  description: 'This is a description',
  body: 'This is a body of the article',
  slug: 'this-is-the-title',
  tagList: ['testing'],
};

const author = {
  username: 'CyTester',
  bio: null,
  image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
  following: false,
};

describe('Article creation flow', () => {
  beforeEach(() => {
    cy.intercept('GET', `${Cypress.env('apiUrl')}/api/tags`, {
      fixture: 'tags.json',
    }).as('getTags');

    cy.loginToApplication();
    cy.wait('@getTags');
  });

  it('creates a new article and validates the API contract', () => {
    const timestamps = {
      createdAt: '2024-01-27T21:52:32.682Z',
      updatedAt: '2024-01-27T21:52:32.682Z',
    };

    cy.intercept('POST', `${Cypress.env('apiUrl')}/api/articles`, (req) => {
      expect(req.body.article).to.deep.include({
        title: article.title,
        description: article.description,
        body: article.body,
      });

      req.reply({
        statusCode: 201,
        body: {
          article: {
            ...article,
            ...timestamps,
            author,
            favorited: false,
            favoritesCount: 0,
          },
        },
      });
    }).as('postArticle');

    cy.intercept(
      'GET',
      `${Cypress.env('apiUrl')}/api/articles/${article.slug}`,
      {
        statusCode: 200,
        body: {
          article: {
            ...article,
            ...timestamps,
            author,
            favorited: false,
            favoritesCount: 0,
          },
        },
      },
    ).as('getCreatedArticle');

    cy.contains('New Article').click();

    cy.get('[formcontrolname="title"]').type(article.title);
    cy.get('[formcontrolname="description"]').type(article.description);
    cy.get('[formcontrolname="body"]').type(article.body);
    cy.contains('Publish Article').click();

    cy.wait('@postArticle').its('response.statusCode').should('eq', 201);
    cy.wait('@getCreatedArticle');

    cy.get('h1').should('contain', article.title);
    cy.get('.article-content').should('contain', article.body);
  });

  it('displays the popular tags from the fixture', () => {
    cy.fixture('tags').then(({ tags }) => {
      cy.get('.tag-list').should('be.visible');
      tags.forEach((tag) => {
        cy.get('.tag-list').should('contain', tag);
      });
    });
  });
});
