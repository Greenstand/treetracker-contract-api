require('dotenv').config();
const chai = require('chai');
const request = require('./lib/supertest');

const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const app = require('../server/app');
const knex = require('../server/database/knex');
const speciesPayout1 = require('./mock/speciesPayout/speciesPayout1');
const speciesPayout2 = require('./mock/speciesPayout/speciesPayout2');
const speciesAgreement2 = require('./mock/speciesAgreement/speciesAgreement2.json');

// Global Seed
const databaseCleaner = require('../database/seeds/00_job_database_cleaner');

describe('/species_payout', () => {
  before(async function () {
    await knex('species_agreement').insert(speciesAgreement2);
    await knex('species_payout').insert(speciesPayout2);
  });

  after(async function () {
    await databaseCleaner.seed(knex);
  });

  describe('POST', () => {
    it('should create a species payout', async () => {
      const res = await request(app)
        .post(`/species_payout`)
        .send(speciesPayout1)
        .set('Accept', 'application/json')
        .expect(201);

      expect(res.body).includes({
        ...speciesPayout1,
        open: true,
      });
      expect(typeof Date.parse(res.body.created_at)).to.eql('number');
    });
  });

  describe('GET', () => {
    it('should get all species payouts', async () => {
      const res = await request(app)
        .get(`/species_payout`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.species_payouts.length).to.eql(2);
      expect(res.body.count).to.eql(2);
    });

    it('should get species payout by id', async () => {
      const res = await request(app)
        .get(`/species_payout/${speciesPayout2.id}`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({
        ...speciesPayout2,
        open: true,
      });
      expect(typeof Date.parse(res.body.created_at)).to.eql('number');
    });
  });

  describe('UPDATE', () => {
    it('should update open boolean field', async () => {
      const res = await request(app)
        .patch(`/species_payout/${speciesPayout2.id}`)
        .send({ open: false })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({
        ...speciesPayout2,
        open: false,
      });
      expect(typeof Date.parse(res.body.closed_at)).to.eql('number');
    });
  });
});
