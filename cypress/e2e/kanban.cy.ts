describe('Kanban Board', () => {
  beforeEach(() => {
    cy.intercept('**/resource/rvxe-9y9u.json**', { fixture: 'permits.json' }).as('getPermits');
    cy.visit('/');
    cy.wait('@getPermits');
  });

  it('displays 5 columns with correct headers', () => {
    cy.get('[class*="column-"]').should('have.length', 5);
    cy.contains('Submitted').should('be.visible');
    cy.contains('Approved').should('be.visible');
    cy.contains('Scheduled').should('be.visible');
    cy.contains('Installed').should('be.visible');
    cy.contains('Closed').should('be.visible');
  });

  it('drags permit from Submitted to Approved', () => {
    cy.get('[id="column-submitted"] app-permit-card').first().as('card');
    cy.get('@card').drag('[id="column-approved"]');
    cy.get('[id="column-approved"] app-permit-card').should('have.length.at.least', 1);
  });

  it('shows offline indicator when disconnected', () => {
    cy.window().then((win) => {
      win.dispatchEvent(new Event('offline'));
    });
    cy.contains('Offline').should('be.visible');
  });
});