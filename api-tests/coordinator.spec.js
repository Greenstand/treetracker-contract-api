require('dotenv').config();
const chai = require('chai');
const request = require('./lib/supertest');

const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const app = require('../server/app');
const knex = require('../server/infra/database/knex');
const coordinationTeam2 = require('./mock/coordinationTeam/coordinationTeam2.json');
const coordinator1 = require('./mock/coordinator/coordinator1');
const coordinator2 = require('./mock/coordinator/coordinator2');
const coordinator3 = require('./mock/coordinator/coordinator3');

// Global Seed
const databaseCleaner = require('../database/seeds/00_job_database_cleaner');
const { COORDINATOR_ROLES } = require('../server/utils/enums');

describe('/coordinator', () => {
  before(async function () {
    await knex('coordination_team').insert(coordinationTeam2);
    await knex('coordinator').insert(coordinator3);
    await knex('coordinator').insert(coordinator2);
  });

  after(async function () {
    await databaseCleaner.seed(knex);
  });

  describe('POST', () => {
    it('should create a coordinator', async () => {
      const res = await request(app)
        .post(`/coordinator`)
        .send(coordinator1)
        .set('Accept', 'application/json')
        .expect(201);

      expect(res.body).includes({ ...coordinator1, active: true });
      expect(typeof Date.parse(res.body.created_at)).to.eql('number');
      expect(res.body.created_at).to.eql(res.body.updated_at);
    });
  });

  describe('GET', () => {
    it('should get all coordinators', async () => {
      const res = await request(app)
        .get(`/coordinator`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.coordinators.length).to.eql(3);
      expect(res.body.count).to.eql(3);
    });

    it('should get coordinator by id', async () => {
      const res = await request(app)
        .get(`/coordinator/${coordinator2.id}`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({ ...coordinator2 });
    });
  });

  describe('UPDATE', () => {
    it('should updated set fields', async () => {
      const res = await request(app)
        .patch(`/coordinator/${coordinator2.id}`)
        .send({ role: COORDINATOR_ROLES.area_manager })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({
        ...coordinator2,
        role: COORDINATOR_ROLES.area_manager,
      });
      expect(Date.parse(res.body.updated_at)).to.greaterThan(
        Date.parse(res.body.created_at),
      );
    });

    it('should "delete" the resource ', async () => {
      const res = await request(app)
        .patch(`/coordinator/${coordinator2.id}`)
        .send({ active: false })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({
        ...coordinator2,
        role: COORDINATOR_ROLES.area_manager,
        active: false,
      });

      await request(app)
        .get(`/coordinator/${coordinator2.id}`)
        .set('Accept', 'application/json')
        .expect(404);

      const res2 = await request(app)
        .get(`/coordinator`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res2.body.coordinators.length).to.eql(2);
      expect(res2.body.count).to.eql(2);
    });
  });
});
