describe('Test with Back-end API for checking global feed likes count', () => {
    beforeEach('login to application', () => {
        cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles', { fixture: '' });
        cy.loginToApplication();
    });

    it('verify global feed likes count', () => {
        cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*', {
            articles: [],
            articlesCount: 0,
        }).as('getFeed');

        cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/*', (req) => {
            req.reply({
                article: {
                    id: 12,
                    slug: "Discover-Bondar-Academy:-Your-Gateway-to-Efficient-Learning-1",
                    title: "Discover Bondar Academy: Your Gateway to Efficient Learning",
                    description: "Discover Bondar Academy's unique place in the educational landscape...",
                    body: "Bondar Academy is a leading platform for efficient education...",
                    createdAt: "2024-01-27T21:52:32.682Z",
                    updatedAt: "2024-01-27T21:52:32.682Z",
                    authorId: 1,
                    tagList: [
                        "qa career",
                        "Bondar Academy",
                        "QA Skills",
                        "Value-Focused"
                    ],
                    author: {
                        username: "Artem Bondar",
                        bio: null,
                        image: "https://storage.googleapis.com/bondar-academy-visuals/Android.png",
                        following: false
                    },
                    favoritedBy: [
                        {
                            id: 3,
                            email: "cytest@test.com",
                            username: "CyTest",
                            password: "$2a$10$yKBkKY1DHqpUg3I0Ts0HKer0bDYu6vYZ7cZllkbzq9RjFFNnOdcUK",
                            image: "https://api.realworld.io/images/smiley-cyrus.jpeg",
                            bio: "Dapifer ambulo tabella celer maiores.",
                            demo: false
                        },
                    ],
                    favorited: true,
                    favoritesCount: 348,
                }
            });
        }).as('getArticle');

        // Visit the global feed
        cy.contains('Global Feed').click()

        // Check the initial heart counts
        cy.get('app-article-list button').then((heartList) => {
            expect(heartList[0]).to.contain('0'); // Ensure this index is correct based on your UI
            expect(heartList[1]).to.contain('378'); // Adjust based on your articles from the fixture
        });

        // Load articles fixture and adjust the favorites count
        cy.fixture('articles').then((file) => {
            expect(file.articles).to.have.length.greaterThan(1); // Ensure there are at least two articles
            const articleLink = file.articles[1].slug; // Get the slug of the second article
        })
    })
})
