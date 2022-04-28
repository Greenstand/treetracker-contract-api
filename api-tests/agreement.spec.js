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
const agreement1 = require('./mock/agreement/agreement1');
const agreement2 = require('./mock/agreement/agreement2');

// Global Seed
const databaseCleaner = require('../database/seeds/00_job_database_cleaner');
const { CURRENCY, AGREEMENT_STATUS } = require('../server/utils/enums');

describe('/agreement', () => {
  before(async function () {
    await knex('consolidation_rule').insert(consolidationRule);
    await knex('species_agreement').insert(speciesAgreement);
    await knex('coordination_team').insert(coordinationTeam);
    await knex('agreement').insert(agreement2);
  });

  after(async function () {
    await databaseCleaner.seed(knex);
  });

  describe('POST', () => {
    it('should error out if either species_agreement_id/(currency and payment) is not present', async () => {
      const agreementCopy = { ...agreement1 };
      delete agreementCopy.capture_payment;

      const res = await request(app)
        .post(`/agreement`)
        .send(agreementCopy)
        .set('Accept', 'application/json')
        .expect(422);

      expect(res.body.message).eql(
        'capture_payment and capture_payment_currency cannot be undefined if species_agreement_id is undefined',
      );
    });

    it('should create a agreement', async () => {
      const res = await request(app)
        .post(`/agreement`)
        .send(agreement1)
        .set('Accept', 'application/json')
        .expect(201);

      expect(res.body).includes({
        ...agreement1,
        status: 'planning',
        listed: true,
      });
      expect(typeof Date.parse(res.body.created_at)).to.eql('number');
      expect(res.body.created_at).to.eql(res.body.updated_at);
    });
  });

  describe('GET', () => {
    it('should get all agreements', async () => {
      const res = await request(app)
        .get(`/agreement`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.agreements.length).to.eql(2);
      expect(res.body.count).to.eql(2);
    });

    it('should get agreement by id', async () => {
      const res = await request(app)
        .get(`/agreement/${agreement2.id}`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({ ...agreement2 });
    });
  });

  describe('UPDATE', () => {
    const updates = {
      description: 'new description',
      capture_payment: '200',
      capture_payment_currency: CURRENCY.USD,
      max_captures: 100,
      listed: false,
      status: AGREEMENT_STATUS.open,
    };

    it('should update set fields', async () => {
      const res = await request(app)
        .patch(`/agreement/${agreement2.id}`)
        .send(updates)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({ ...agreement2, ...updates });
    });

    it('should error out-- an open agreement cannot be updated', async () => {
      const res = await request(app)
        .patch(`/agreement/${agreement2.id}`)
        .send({ description: 'another description' })
        .set('Accept', 'application/json')
        .expect(422);

      expect(res.body.message).to.eql(
        'For open agreements, its status can either be set to close or its listed flag updated',
      );
    });

    it('should close an open agreement', async () => {
      const res = await request(app)
        .patch(`/agreement/${agreement2.id}`)
        .send({ status: AGREEMENT_STATUS.closed })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({
        ...agreement2,
        ...updates,
        status: AGREEMENT_STATUS.closed,
      });
      expect(typeof Date.parse(res.body.closed_at)).to.eql('number');
    });
  });
});
