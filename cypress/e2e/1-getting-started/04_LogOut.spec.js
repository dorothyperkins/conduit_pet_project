/// <reference types="cypress" />

describe('User logout', () => {
  beforeEach(() => {
    cy.loginToApplication();
  });

  it('allows the user to log out successfully', { retries: 2 }, () => {
    cy.contains('Settings').click();
    cy.contains('Or click here to logout').click();
    cy.get('.navbar-nav').should('contain', 'Sign up');
  });
});
