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
const agreementRegion1 = require('./mock/agreementRegion/agreementRegion1');
const agreementRegion2 = require('./mock/agreementRegion/agreementRegion2');

// Global Seed
const databaseCleaner = require('../database/seeds/00_job_database_cleaner');

describe('/agreement_region', () => {
  before(async function () {
    await knex('consolidation_rule').insert(consolidationRule);
    await knex('species_agreement').insert(speciesAgreement);
    await knex('coordination_team').insert(coordinationTeam);
    await knex('agreement').insert(agreement);
    await knex('agreement_region').insert(agreementRegion2);
  });

  after(async function () {
    await databaseCleaner.seed(knex);
  });

  describe('POST', () => {
    it('should create an agreement region', async () => {
      const res = await request(app)
        .post(`/agreement_region`)
        .send(agreementRegion1)
        .set('Accept', 'application/json')
        .expect(201);

      expect(res.body).includes({
        ...agreementRegion1,
        open: true,
      });
      expect(typeof Date.parse(res.body.created_at)).to.eql('number');
    });
  });

  describe('GET', () => {
    it('should get all agreement regions', async () => {
      const res = await request(app)
        .get(`/agreement_region`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.agreement_regions.length).to.eql(2);
      expect(res.body.count).to.eql(2);
    });

    it('should get species payout by id', async () => {
      const res = await request(app)
        .get(`/agreement_region/${agreementRegion2.id}`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({
        ...agreementRegion2,
        open: true,
      });
    });
  });

  describe('UPDATE', () => {
    it('should update open boolean field', async () => {
      const res = await request(app)
        .patch(`/agreement_region/${agreementRegion2.id}`)
        .send({ open: false })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({
        ...agreementRegion2,
        open: false,
      });
      expect(typeof Date.parse(res.body.closed_at)).to.eql('number');
    });
  });
});
