describe('Global feed like counts', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      `${Cypress.env('apiUrl')}/api/articles/feed*`,
      {
        statusCode: 200,
        body: {
          articles: [],
          articlesCount: 0,
        },
      },
    ).as('getFeed');

    cy.fixture('articles').then((articlesFixture) => {
      cy.intercept(
        'GET',
        `${Cypress.env('apiUrl')}/api/articles?limit=10&offset=0`,
        {
          statusCode: 200,
          body: articlesFixture,
        },
      ).as('getArticlesPage');

      cy.intercept(
        'GET',
        `${Cypress.env('apiUrl')}/api/articles`,
        {
          statusCode: 200,
          body: articlesFixture,
        },
      ).as('getArticles');
    });

    cy.loginToApplication();
  });

  it('renders a consistent like count for each article', () => {
    cy.contains('Global Feed').click();
    cy.wait(['@getFeed', '@getArticlesPage']);

    cy.fixture('articles').then(({ articles }) => {
      cy.get('app-article-list app-article-preview').should(
        'have.length',
        articles.length,
      );

      cy.get('app-article-list app-article-preview').each(($preview, index) => {
        cy.wrap($preview)
          .find('button.btn-outline-primary')
          .invoke('text')
          .then((text) => {
            const heartCount = parseInt(text.trim(), 10);
            expect(heartCount).to.eq(articles[index].favoritesCount);
          });
      });

      const { slug, title } = articles[1];
      cy.contains('app-article-preview', title)
        .find('a.preview-link')
        .should('have.attr', 'href')
        .and('include', slug);
    });
  });
});
