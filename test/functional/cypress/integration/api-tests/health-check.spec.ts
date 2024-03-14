// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

const healthEndpoint = `${Cypress.env("apiUrl")}/v1/api/health`;

describe("Health API", function () {

  context(`GET ${healthEndpoint}`, function () {
    it("Health Returns a 200 Response", function () {
      cy.request(healthEndpoint).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('Healths');
        expect(response.body.Healths).to.be.an('Array');
        expect(response.body.Healths.length).to.be.eq(2);
      });
    });

    it("Health Response Includes Content_type ", function () {
      cy.request(healthEndpoint).then((response) => {
        expect(response.headers).to.have.property('content-type', 'application/json') //assert Request header
      });
    });

    it("Health Response Time Less Than 3 Seconds", function () {
      const start = Date.now();
      cy.request(healthEndpoint).then((response) => {
        const responseTime = Date.now() - start;
        expect(responseTime).to.be.lt(3000);
      });
    });

    it("Health Response Includes TimeStamp", function () {
      cy.request(healthEndpoint).then((response) => {
        expect(response.body).to.have.property('TimeStamp');
        expect(response.body).to.have.property('TimeStamp').length.to.be.greaterThan(1);
      });
    });

    it("Health Response Includes Healthy Status", function () {
      cy.request(healthEndpoint).then((response) => {
        expect(response.body).to.have.property('Status');
        expect(response.body).to.have.property('Status').to.eq("healthy");
      });
    });

    it("Health Response Includes Healths", function () {
      cy.request(healthEndpoint).then((response) => {
        expect(response.body).to.have.property('Healths');
      });
    });

    it("Health Response Healths Includes 1 or more Items", function () {
      cy.request(healthEndpoint).then((response) => {
        expect(response.body).to.have.property('Healths');
        expect(response.body.Healths.length).to.be.gte(1);
      });
    });

    it("Health Response All Healths Include Duration", function () {
      cy.request(healthEndpoint).then((response) => {
        expect(response.body).to.have.property('Healths');
        let healths = response.body.Healths;
        for (let i = 0; i < healths.length; i++) {
          expect(healths[i]).to.have.property('Duration');
          expect(healths[i].Duration.length).to.be.gt(0);
        }
      });
    });

    it("Health Response All Healths Are Healthy", function () {
      cy.request(healthEndpoint).then((response) => {
        expect(response.body).to.have.property('Healths');
        let healths = response.body.Healths;
        for (let i = 0; i < healths.length; i++) {
          expect(healths[i]).to.have.property('Healthy');
          expect(healths[i].Healthy).to.be.true;
        }
      });
    });

    it("Health Response All Healths Include TimeStamp", function () {
      cy.request(healthEndpoint).then((response) => {
        expect(response.body).to.have.property('Healths');
        let healths = response.body.Healths;
        for (let i = 0; i < healths.length; i++) {
          expect(healths[i]).to.have.property('TimeStamp');
          expect(healths[i].TimeStamp.length).to.be.gt(0);
        }
      });
    });
  });
});
