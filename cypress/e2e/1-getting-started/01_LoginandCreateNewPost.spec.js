import {
  buildArticleResponse,
  createTimestamps,
  defaultAuthor,
} from '../../support/utils/article.js';

const article = {
  title: 'This is the title',
  description: 'This is a description',
  body: 'This is a body of the article',
  slug: 'this-is-the-title',
  tagList: ['testing'],
};

describe('Article creation flow', () => {
  beforeEach(() => {
    cy.stubPopularTags();
    cy.loginToApplication();
    cy.wait('@getTags');
  });

  it('creates a new article and validates the API contract', () => {
    const timestamps = createTimestamps();
    const articleResponse = buildArticleResponse(article, {
      author: defaultAuthor,
      timestamps,
    });

    cy.intercept('POST', `${Cypress.env('apiUrl')}/api/articles`, (req) => {
      expect(req.body.article).to.deep.include({
        title: article.title,
        description: article.description,
        body: article.body,
      });

      req.reply({
        statusCode: 201,
        body: articleResponse,
      });
    }).as('postArticle');

    cy.intercept(
      'GET',
      `${Cypress.env('apiUrl')}/api/articles/${article.slug}`,
      {
        statusCode: 200,
        body: articleResponse,
      },
    ).as('getCreatedArticle');

    cy.contains('New Article').click();

    cy.get('[formcontrolname="title"]').type(article.title);
    cy.get('[formcontrolname="description"]').type(article.description);
    cy.get('[formcontrolname="body"]').type(article.body);
    cy.contains('Publish Article').click();

    cy.wait('@postArticle').its('response.statusCode').should('eq', 201);
    cy.wait('@getCreatedArticle')
      .its('response.body.article')
      .should('deep.include', article);

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
