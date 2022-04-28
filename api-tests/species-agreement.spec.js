require('dotenv').config();
const chai = require('chai');
const request = require('./lib/supertest');

const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const app = require('../server/app');
const knex = require('../server/infra/database/knex');
const speciesAgreement1 = require('./mock/speciesAgreement/speciesAgreement1.json');
const speciesAgreement2 = require('./mock/speciesAgreement/speciesAgreement2.json');

// Global Seed
const databaseCleaner = require('../database/seeds/00_job_database_cleaner');

describe('/species_agreement', () => {
  before(async function () {
    await knex('species_agreement').insert(speciesAgreement2);
  });

  after(async function () {
    await databaseCleaner.seed(knex);
  });

  describe('POST', () => {
    it('should create a species agreement', async () => {
      const res = await request(app)
        .post(`/species_agreement`)
        .send(speciesAgreement1)
        .set('Accept', 'application/json')
        .expect(201);

      expect(res.body).includes({
        ...speciesAgreement1,
        listed: true,
        variable_species_payout: false,
      });
      expect(typeof Date.parse(res.body.created_at)).to.eql('number');
    });
  });

  describe('GET', () => {
    it('should get all species agreements', async () => {
      const res = await request(app)
        .get(`/species_agreement`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.species_agreements.length).to.eql(2);
      expect(res.body.count).to.eql(2);
    });

    it('should get species agreement by id', async () => {
      const res = await request(app)
        .get(`/species_agreement/${speciesAgreement2.id}`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({ ...speciesAgreement2 });
    });
  });

  describe('UPDATE listed variable', () => {
    it('should updated listed', async () => {
      const res = await request(app)
        .patch(`/species_agreement/${speciesAgreement2.id}`)
        .send({ listed: false })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({ ...speciesAgreement2, listed: false });
    });

    it('should get all species agreements without archived ones', async () => {
      const res = await request(app)
        .get(`/species_agreement`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.species_agreements.length).to.eql(1);
      expect(res.body.count).to.eql(1);
      expect(res.body.species_agreements[0].listed).to.be.true;
    });

    it('should get all archived ones if requested', async () => {
      const res = await request(app)
        .get(`/species_agreement`)
        .query({ listed: false })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.species_agreements.length).to.eql(1);
      expect(res.body.count).to.eql(1);
      expect(res.body.species_agreements[0].listed).to.be.false;
    });
  });
});
