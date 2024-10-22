describe('Test with Back-end API', () => {

    beforeEach('login to application', () => {
      cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles', { fixture: 'tags.json' })
      cy.loginToApplication()
    })
  
    it('Verify creating and deleting an article', () => {
      cy.intercept('POST', '**/articles*').as('postArticles')
      cy.intercept('DELETE', '**/articles/*').as('deleteArticle')
      cy.intercept('GET', '**/articles?limit=10&offset=0').as('getArticles')
  
      // Create a new article
      cy.contains('New Article').click()
  
      cy.get('[formcontrolname="title"]').type('This is the title articles for deleting')
      cy.get('[formcontrolname="description"]').type('This is a description')
      cy.get('[formcontrolname="body"]').type('This is a body of the article')
      cy.contains('Publish Article').click()
  
      // Verify the article is created successfully
      cy.wait('@postArticles', { timeout: 10000 }).then((xhr) => {
        expect(xhr.response.statusCode).to.equal(201)
        expect(xhr.request.body.article.body).to.equal('This is a body of the article')
        expect(xhr.response.body.article.description).to.equal('This is a description')
      })
  
      // Delete the created article
      cy.contains('Delete Article').click()
  
      // Verify the delete request
      cy.wait('@deleteArticle', { timeout: 10000 }).then((xhr) => {
        expect(xhr.response.statusCode).to.equal(204)
      })
  
      // Verify the article is no longer in the list
      cy.wait('@getArticles').then((xhr) => {
        expect(xhr.response.statusCode).to.equal(200)
        const articles = xhr.response.body.articles
        const deletedArticle = articles.find(article => article.title === 'This is the title articles for deleting')
        expect(deletedArticle).to.be.undefined
      })
    })
  })
  