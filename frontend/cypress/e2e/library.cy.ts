describe("Library", () => {
  beforeEach(() => {
    cy.visit("/login");

    cy.get("input[name='username']").type("marion@test.fr");
    cy.get("input[name='password']").type("test1234");

    cy.contains("Soumettre").click();

    // Vérifie juste qu'on n'est plus sur la page login
    cy.url().should("not.include", "/login");

    // Va ensuite sur la bibliothèque
    cy.visit("/library");
  });

  it("opens search modal", () => {
    cy.contains("Ajouter un livre").click();

    cy.get('[data-testid="search-modal"]').should("be.visible");
  });

  it("closes search modal", () => {
    cy.get("body").type("{esc}");

    cy.get('[data-testid="search-modal"]').should("not.exist");
  });

  it("finds books after a search", () => {
    cy.contains("Ajouter un livre").click();

    cy.get('input[placeholder="Nom du livre, auteur..."]').type("Harry Potter");

    cy.contains("button", "Rechercher").click();

    cy.get('[data-testid="book-result"]', {
      timeout: 10000,
    }).should("have.length.at.least", 1);
  });
});
