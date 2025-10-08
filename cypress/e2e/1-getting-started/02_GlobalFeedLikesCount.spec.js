describe('Global feed like counts', () => {
  beforeEach(() => {
    cy.fixture('articles').as('articlesResponse');

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

    cy.get('@articlesResponse').then((articlesFixture) => {
      cy.intercept(
        'GET',
        `${Cypress.env('apiUrl')}/api/articles?limit=10&offset=0`,
        {
          statusCode: 200,
          body: articlesFixture,
        },
      ).as('getArticlesPage');
    });

    cy.loginToApplication();
  });

  it('renders a consistent like count for each article', () => {
    cy.contains('Global Feed').click();
    cy.wait(['@getFeed', '@getArticlesPage']);

    cy.get('@articlesResponse').then(({ articles }) => {
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

      cy.contains('app-article-preview', articles[0].title)
        .find('a.author')
        .should('contain', articles[0].author.username);
    });
  });
});
