const apiUrl = Cypress.env('apiUrl');

Cypress.Commands.add('loginToApplication', () => {
  const userCredentials = {
    user: {
      email: Cypress.env('username'),
      password: Cypress.env('password'),
    },
  };

  cy.request('POST', `${apiUrl}/api/users/login`, userCredentials)
    .its('body.user.token')
    .then((token) => {
      cy.wrap(token).as('token');

      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('jwtToken', token);
        },
      });
    });
});

Cypress.Commands.add('stubPopularTags', () => {
  cy.intercept('GET', `${apiUrl}/api/tags`, {
    fixture: 'tags.json',
  }).as('getTags');
});
