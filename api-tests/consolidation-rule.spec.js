require('dotenv').config();
const chai = require('chai');
const request = require('./lib/supertest');

const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const app = require('../server/app');
const knex = require('../server/infra/database/knex');
const consolidationRule1 = require('./mock/consolidationRule/consolidationRule1.json');
const consolidationRule2 = require('./mock/consolidationRule/consolidationRule2.json');

// Global Seed
const databaseCleaner = require('../database/seeds/00_job_database_cleaner');

describe.only('/consolidation_rule', () => {
  before(async function () {
    await knex('consolidation_rule').insert(consolidationRule2);
  });

  after(async function () {
    await databaseCleaner.seed(knex);
  });

  describe('POST', () => {
    it('should create a consolidation rule', async () => {
      const res = await request(app)
        .post(`/consolidation_rule`)
        .send(consolidationRule1)
        .set('Accept', 'application/json')
        .expect(201);

      const consolidationRuleCopy = { ...consolidationRule1 };
      delete consolidationRuleCopy.parameters;

      expect(res.body.parameters).to.eql(consolidationRule1.parameters);
      expect(res.body).includes({
        ...consolidationRuleCopy,
        listed: true,
      });
      expect(typeof Date.parse(res.body.created_at)).to.eql('number');
    });
  });

  describe('GET', () => {
    it('should get all consolidation rules', async () => {
      const res = await request(app)
        .get(`/consolidation_rule`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.consolidation_rules.length).to.eql(2);
      expect(res.body.count).to.eql(2);
    });

    it('should get consolidation rule by id', async () => {
      const res = await request(app)
        .get(`/consolidation_rule/${consolidationRule2.id}`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({ ...consolidationRule2 });
    });
  });

  describe('UPDATE', () => {
    it('should updated listed', async () => {
      const res = await request(app)
        .patch(`/consolidation_rule/${consolidationRule2.id}`)
        .send({ listed: false })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({ ...consolidationRule2, listed: false });
    });

    describe('UPDATE listed variable', () => {
      it('should updated listed', async () => {
        const res = await request(app)
          .patch(`/consolidation_rule/${consolidationRule2.id}`)
          .send({ listed: false })
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body).includes({
          ...consolidationRule2,
          listed: false,
        });
      });

      it('should get all consolidation rules without archived ones', async () => {
        const res = await request(app)
          .get(`/consolidation_rule`)
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body.consolidation_rules.length).to.eql(1);
        expect(res.body.count).to.eql(1);
        expect(res.body.consolidation_rules[0].listed).to.be.true;
      });

      it('should get all archived ones if requested', async () => {
        const res = await request(app)
          .get(`/consolidation_rule`)
          .query({ listed: false })
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body.consolidation_rules.length).to.eql(1);
        expect(res.body.count).to.eql(1);
        expect(res.body.consolidation_rules[0].listed).to.be.false;
      });
    });
  });
});
