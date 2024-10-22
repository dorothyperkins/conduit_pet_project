
describe('Test with Back-end API', () => {

  beforeEach('login to application', () => {
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles', { fixture: 'tags.json' })
    cy.loginToApplication()
  })

  it('Verify correct request and response', () => {
    cy.intercept('POST', '**/articles*').as('postArticles')

    cy.contains('New Article').click()

    cy.get('[formcontrolname="title"]').type('This is the title')
    cy.get('[formcontrolname="description"]').type('This is a description')
    cy.get('[formcontrolname="body"]').type('This is a body of the article')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles', { timeout: 10000 }).then((xhr) => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body).to.equal('This is a body of the article')
      expect(xhr.response.body.article.description).to.equal('This is a description')
    })

  })

  it('verify popular tags are displayed', () => {
    cy.get('.tag-list')
      .should('contain', 'Test')
      .and('contain', 'GitHub')
      .and('contain', 'Coding')
      .and('contain', 'Git')
  })
})