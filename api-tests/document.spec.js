require('dotenv').config();
const chai = require('chai');
const request = require('./lib/supertest');

const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const app = require('../server/app');
const knex = require('../server/database/knex');
const document1 = require('./mock/document/document1.json');
const document2 = require('./mock/document/document2.json');

// Global Seed
const databaseCleaner = require('../database/seeds/00_job_database_cleaner');

describe('/document', () => {
  before(async function () {
    await knex('document').insert(document2);
  });

  after(async function () {
    await databaseCleaner.seed(knex);
  });

  describe('POST', () => {
    it('should create a document', async () => {
      const res = await request(app)
        .post(`/document`)
        .send(document1)
        .set('Accept', 'application/json')
        .expect(201);

      expect(res.body).includes({ ...document1, version: 1, listed: true });
      expect(typeof Date.parse(res.body.created_at)).to.eql('number');
    });
  });

  describe('GET', () => {
    it('should get all documents', async () => {
      const res = await request(app)
        .get(`/document`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.documents.length).to.eql(2);
      expect(res.body.count).to.eql(2);
    });

    it('should get document by id', async () => {
      const res = await request(app)
        .get(`/document/${document2.id}`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({ ...document2 });
      expect(typeof Date.parse(res.body.created_at)).to.eql('number');
    });
  });

  describe('UPDATE', () => {
    it('should updated listed', async () => {
      const res = await request(app)
        .patch(`/document/${document2.id}`)
        .send({ listed: false })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({ ...document2, listed: false });
    });
  });
});
