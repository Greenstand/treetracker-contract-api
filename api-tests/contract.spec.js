require('dotenv').config();
const chai = require('chai');
const request = require('./lib/supertest');

const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const app = require('../server/app');
const knex = require('../server/database/knex');
const consolidationRule = require('./mock/consolidationRule/consolidationRule2.json');
const coordinationTeam = require('./mock/coordinationTeam/coordinationTeam2.json');
const speciesAgreement = require('./mock/speciesAgreement/speciesAgreement2.json');
const agreement = require('./mock/agreement/agreement2');
const contract1 = require('./mock/contract/contract1');
const contract2 = require('./mock/contract/contract2');

// Global Seed
const databaseCleaner = require('../database/seeds/00_job_database_cleaner');
const { CONTRACT_STATUS } = require('../server/utils/enums');

describe('/contract', () => {
  before(async function () {
    await knex('consolidation_rule').insert(consolidationRule);
    await knex('species_agreement').insert(speciesAgreement);
    await knex('coordination_team').insert(coordinationTeam);
    await knex('agreement').insert(agreement);
    await knex('contract').insert(contract2);
  });

  after(async function () {
    await databaseCleaner.seed(knex);
  });

  let contract1Id;

  describe('POST', () => {
    it('should create a contract', async () => {
      const res = await request(app)
        .post(`/contract`)
        .send(contract1)
        .set('Accept', 'application/json')
        .expect(201);

      contract1Id = res.body.id;

      expect(res.body).includes({
        ...contract1,
        status: 'unsigned',
        listed: true,
      });
      expect(typeof Date.parse(res.body.created_at)).to.eql('number');
      expect(res.body.created_at).to.eql(res.body.updated_at);
    });
  });

  describe('GET', () => {
    it('should get all contracts', async () => {
      const res = await request(app)
        .get(`/contract`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.contracts.length).to.eql(2);
      expect(res.body.count).to.eql(2);
    });

    it('should get contract by id', async () => {
      const res = await request(app)
        .get(`/contract/${contract2.id}`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({ ...contract2 });
      expect(typeof Date.parse(res.body.created_at)).to.eql('number');
    });
  });

  describe('UPDATE', () => {
    it('should update status to signed', async () => {
      const res = await request(app)
        .patch(`/contract/${contract2.id}`)
        .send({ status: CONTRACT_STATUS.signed })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({
        ...contract2,
        status: CONTRACT_STATUS.signed,
      });
      expect(Date.parse(res.body.updated_at)).to.greaterThan(
        Date.parse(res.body.created_at),
      );
      expect(typeof Date.parse(res.body.signed_at)).to.eql('number');
    });

    it('should complete an open contract', async () => {
      const res = await request(app)
        .patch(`/contract/${contract2.id}`)
        .send({ status: CONTRACT_STATUS.completed })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({
        ...contract2,
        status: CONTRACT_STATUS.completed,
      });
      expect(typeof Date.parse(res.body.closed_at)).to.eql('number');
      expect(Date.parse(res.body.closed_at)).to.greaterThan(
        Date.parse(res.body.signed_at),
      );
    });

    it('should cancel a signed contract', async () => {
      await request(app)
        .patch(`/contract/${contract1Id}`)
        .send({ status: CONTRACT_STATUS.signed })
        .set('Accept', 'application/json')
        .expect(200);

      const res = await request(app)
        .patch(`/contract/${contract1Id}`)
        .send({ status: CONTRACT_STATUS.cancelled })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({
        ...contract1,
        status: CONTRACT_STATUS.cancelled,
      });

      expect(typeof Date.parse(res.body.closed_at)).to.eql('number');
      expect(Date.parse(res.body.closed_at)).to.greaterThan(
        Date.parse(res.body.signed_at),
      );
    });
  });
});
