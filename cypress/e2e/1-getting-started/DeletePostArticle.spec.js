describe('Article Deletion Tests', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMjAzNH0sImlhdCI6MTcyOTUyOTE1MiwiZXhwIjoxNzM0NzEzMTUyfQ.5bNuAQ6pudQ5gCtccq-VaaprdCv-o4MuMiyxKdrv_uE';

    it('should delete an article from the global feed', () => {
        const articleData = {
            article: {
                tagList: [],
                title: 'Request from the API',
                description: 'API testing is easy',
                body: 'Angular is cool'
            }
        };

        // Create a new article
        cy.request({
            url: 'https://conduit-api.bondaracademy.com/api/articles',
            method: 'POST',
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: articleData
        }).then(response => {
            expect(response.status).to.equal(201);

            // Navigate to Global Feed (consider using cy.visit if necessary)
            cy.visit('/'); // or navigate to the global feed URL directly
            cy.contains('Global Feed').should('be.visible').click(); // Ensure the Global Feed link is visible before clicking
            cy.get('.article-preview').first().click(); // Click the article

            // Delete the article
            cy.get('.article-actions').contains('Delete Article').click();
            cy.get('.btn.btn-outline-danger').click(); // Confirm deletion if there's a confirmation dialog

            // Verify the article is deleted
            const articleSlug = response.body.article.slug; // Store slug for deletion
            cy.request({
                url: `https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`,
                method: 'GET',
                headers: {
                    Authorization: `Token ${token}`
                },
                failOnStatusCode: false // Don't fail the test if the article doesn't exist
            }).then(getResponse => {
                expect(getResponse.status).to.equal(404); // Article should return 404 not found
            })
        })
    })
})