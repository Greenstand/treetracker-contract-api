require('dotenv').config();
const chai = require('chai');
const request = require('./lib/supertest');

const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const app = require('../server/app');
const knex = require('../server/infra/database/knex');
const coordinationTeam1 = require('./mock/coordinationTeam/coordinationTeam1.json');
const coordinationTeam2 = require('./mock/coordinationTeam/coordinationTeam2.json');

// Global Seed
const databaseCleaner = require('../database/seeds/00_job_database_cleaner');

describe.only('/coordination_team', () => {
  before(async function () {
    await knex('coordination_team').insert(coordinationTeam2);
  });

  after(async function () {
    await databaseCleaner.seed(knex);
  });

  describe('POST', () => {
    it('should create a coordination team', async () => {
      const res = await request(app)
        .post(`/coordination_team`)
        .send(coordinationTeam1)
        .set('Accept', 'application/json')
        .expect(201);

      expect(res.body).includes({
        ...coordinationTeam1,
        listed: true,
      });
      expect(typeof Date.parse(res.body.created_at)).to.eql('number');
      expect(res.body.created_at).to.eql(res.body.updated_at);
    });
  });

  describe('GET', () => {
    it('should get all coordination teams', async () => {
      const res = await request(app)
        .get(`/coordination_team`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.coordination_teams.length).to.eql(2);
      expect(res.body.count).to.eql(2);
    });

    it('should get coordination team by id', async () => {
      const res = await request(app)
        .get(`/coordination_team/${coordinationTeam2.id}`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({
        ...coordinationTeam2,
        listed: true,
      });
    });
  });

  describe('UPDATE', () => {
    const name = 'new name';
    const description = 'new description';
    it('should update set fields', async () => {
      const res = await request(app)
        .patch(`/coordination_team/${coordinationTeam2.id}`)
        .send({ name, description })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({
        ...coordinationTeam2,
        name,
        description,
      });
      expect(Date.parse(res.body.updated_at)).to.greaterThan(
        Date.parse(res.body.created_at),
      );
    });

    describe('UPDATE listed variable', () => {
      it('should updated listed', async () => {
        const res = await request(app)
          .patch(`/coordination_team/${coordinationTeam2.id}`)
          .send({ listed: false })
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body).includes({
          ...coordinationTeam2,
          name,
          description,
          listed: false,
        });
      });

      it('should get all species agreements without archived ones', async () => {
        const res = await request(app)
          .get(`/coordination_team`)
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body.coordination_teams.length).to.eql(1);
        expect(res.body.count).to.eql(1);
        expect(res.body.coordination_teams[0].listed).to.be.true;
      });

      it('should get all archived ones if requested', async () => {
        const res = await request(app)
          .get(`/coordination_team`)
          .query({ listed: false })
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body.coordination_teams.length).to.eql(1);
        expect(res.body.count).to.eql(1);
        expect(res.body.coordination_teams[0].listed).to.be.false;
      });
    });
  });
});
