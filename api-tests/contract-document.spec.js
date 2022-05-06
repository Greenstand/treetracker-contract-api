require('dotenv').config();
const chai = require('chai');
const request = require('./lib/supertest');

const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const app = require('../server/app');
const knex = require('../server/infra/database/knex');
const consolidationRule = require('./mock/consolidationRule/consolidationRule2.json');
const coordinationTeam = require('./mock/coordinationTeam/coordinationTeam2.json');
const speciesAgreement = require('./mock/speciesAgreement/speciesAgreement2.json');
const agreement = require('./mock/agreement/agreement2');
const contract = require('./mock/contract/contract2');
const document = require('./mock/document/document2.json');
const contractDocument1 = require('./mock/contractDocument/contractDocument1');
const contractDocument2 = require('./mock/contractDocument/contractDocument2');

// Global Seed
const databaseCleaner = require('../database/seeds/00_job_database_cleaner');

describe('/contract_document', () => {
  before(async function () {
    await knex('consolidation_rule').insert(consolidationRule);
    await knex('species_agreement').insert(speciesAgreement);
    await knex('coordination_team').insert(coordinationTeam);
    await knex('agreement').insert(agreement);
    await knex('contract').insert(contract);
    await knex('document').insert(document);
    await knex('contract_document').insert(contractDocument2);
  });

  after(async function () {
    await databaseCleaner.seed(knex);
  });

  describe('POST', () => {
    it('should create a document', async () => {
      const res = await request(app)
        .post(`/contract_document`)
        .send(contractDocument1)
        .set('Accept', 'application/json')
        .expect(201);

      expect(res.body).includes({ ...contractDocument1, listed: true });
      expect(typeof Date.parse(res.body.created_at)).to.eql('number');
    });
  });

  describe('GET', () => {
    it('should get all documents', async () => {
      const res = await request(app)
        .get(`/contract_document`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.contract_documents.length).to.eql(2);
      expect(res.body.count).to.eql(2);
    });

    it('should get contract_document by id', async () => {
      const res = await request(app)
        .get(`/contract_document/${contractDocument2.id}`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({ ...contractDocument2 });
    });
  });

  describe('UPDATE', () => {
    it('should updated listed', async () => {
      const res = await request(app)
        .patch(`/contract_document/${contractDocument2.id}`)
        .send({ listed: false })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({ ...contractDocument2, listed: false });
    });

    it('should get all contract documents without archived resources', async () => {
      const res = await request(app)
        .get(`/contract_document`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.contract_documents.length).to.eql(1);
      expect(res.body.count).to.eql(1);
      expect(res.body.contract_documents[0].listed).to.be.true;
    });

    it('should get all archived resources if requested', async () => {
      const res = await request(app)
        .get(`/contract_document`)
        .query({ listed: false })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.contract_documents.length).to.eql(1);
      expect(res.body.count).to.eql(1);
      expect(res.body.contract_documents[0].listed).to.be.false;
    });
  });
});
