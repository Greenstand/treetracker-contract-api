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
const contract1 = require('./mock/contract/contract1');
const contract2 = require('./mock/contract/contract2');
const contract3 = require('./mock/contract/contract3');

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
  let contract3Id;

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

      const res2 = await request(app)
        .post(`/contract`)
        .send(contract3)
        .set('Accept', 'application/json')
        .expect(201);
      contract3Id = res2.body.id;
    });
  });

  describe('GET', () => {
    it('should get all contracts', async () => {
      const res = await request(app)
        .get(`/contract`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body.contracts.length).to.eql(3);
      expect(res.body.count).to.eql(3);
    });

    it('should get contract by id', async () => {
      const res = await request(app)
        .get(`/contract/${contract2.id}`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({ ...contract2 });
    });
  });

  describe('UPDATE', () => {
    const updates = {
      notes: 'notes updated',
    };

    it('should error out -- unsigned contracts cannot be archived and set to signed', async () => {
      const res = await request(app)
        .patch(`/contract/${contract2.id}`)
        .send({ status: CONTRACT_STATUS.signed, listed: false })
        .set('Accept', 'application/json')
        .expect(422);

      expect(res.body.message).eql(
        'unsigned contracts can only be signed or aborted and cannot be archived when set to "signed"',
      );
    });

    it('should error out -- unsigned contracts status can only be set to signed or aborted', async () => {
      const res = await request(app)
        .patch(`/contract/${contract2.id}`)
        .send({ status: CONTRACT_STATUS.completed })
        .set('Accept', 'application/json')
        .expect(422);

      expect(res.body.message).eql(
        'unsigned contracts can only be signed or aborted and cannot be archived when set to "signed"',
      );
    });

    it('should update an unsigned contract', async () => {
      const res = await request(app)
        .patch(`/contract/${contract2.id}`)
        .send(updates)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).includes({
        ...contract2,
        ...updates,
      });
      expect(Date.parse(res.body.updated_at)).to.greaterThan(
        Date.parse(res.body.created_at),
      );
    });

    describe('contract2 flow -- unsigned, signed, completed, archived', () => {
      it('should update status to signed', async () => {
        const res = await request(app)
          .patch(`/contract/${contract2.id}`)
          .send({ status: CONTRACT_STATUS.signed })
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body).includes({
          ...contract2,
          ...updates,
          status: CONTRACT_STATUS.signed,
        });
        expect(Date.parse(res.body.updated_at)).to.greaterThan(
          Date.parse(res.body.created_at),
        );
        expect(typeof Date.parse(res.body.signed_at)).to.eql('number');
      });

      it('should error out -- signed contracts cannot be updated', async () => {
        const res = await request(app)
          .patch(`/contract/${contract2.id}`)
          .send({ listed: false })
          .set('Accept', 'application/json')
          .expect(422);

        expect(res.body.message).eql(
          'Signed contracts cannot be updated except setting the status to "completed" or "cancelled"',
        );
      });

      it('should complete a signed contract', async () => {
        const res = await request(app)
          .patch(`/contract/${contract2.id}`)
          .send({ status: CONTRACT_STATUS.completed })
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body).includes({
          ...contract2,
          ...updates,
          status: CONTRACT_STATUS.completed,
        });
        expect(typeof Date.parse(res.body.closed_at)).to.eql('number');
        expect(Date.parse(res.body.closed_at)).to.greaterThan(
          Date.parse(res.body.signed_at),
        );
      });

      it('should error out -- completed contracts can only be archived', async () => {
        const res = await request(app)
          .patch(`/contract/${contract2.id}`)
          .send({ status: CONTRACT_STATUS.cancelled })
          .set('Accept', 'application/json')
          .expect(422);

        expect(res.body.message).eql('Contract can only be archived');
      });

      it('should archive a completed contract', async () => {
        const res = await request(app)
          .patch(`/contract/${contract2.id}`)
          .send({ listed: false })
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body).includes({
          ...contract2,
          ...updates,
          status: CONTRACT_STATUS.completed,
          listed: false,
        });

        const res2 = await request(app)
          .get(`/contract`)
          .set('Accept', 'application/json')
          .expect(200);

        expect(res2.body.contracts.length).to.eql(2);
        expect(res2.body.count).to.eql(2);
        expect(res2.body.contracts[0].listed).to.be.true;
      });
    });

    describe('contract1 flow -- unsigned, signed, cancelled, archived', () => {
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

      it('should error out -- cancelled contracts can only be archived', async () => {
        const res = await request(app)
          .patch(`/contract/${contract1Id}`)
          .send({ status: CONTRACT_STATUS.completed })
          .set('Accept', 'application/json')
          .expect(422);

        expect(res.body.message).eql('Contract can only be archived');
      });

      it('should archive a cancelled contract', async () => {
        const res = await request(app)
          .patch(`/contract/${contract1Id}`)
          .send({ listed: false })
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body).includes({
          ...contract1,
          status: CONTRACT_STATUS.cancelled,
          listed: false,
        });

        const res2 = await request(app)
          .get(`/contract`)
          .set('Accept', 'application/json')
          .expect(200);

        expect(res2.body.contracts.length).to.eql(1);
        expect(res2.body.count).to.eql(1);
      });
    });

    describe('contract3 flow -- unsigned, aborted', () => {
      it('should abort an unsigned contract', async () => {
        const res = await request(app)
          .patch(`/contract/${contract3Id}`)
          .send({ status: CONTRACT_STATUS.aborted })
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body).includes({
          ...contract3,
          status: CONTRACT_STATUS.aborted,
        });

        expect(typeof Date.parse(res.body.closed_at)).to.eql('number');
        expect(Date.parse(res.body.closed_at)).to.greaterThan(
          Date.parse(res.body.created_at),
        );
      });

      it('should error out -- aborted contracts can only be archived', async () => {
        const res = await request(app)
          .patch(`/contract/${contract3Id}`)
          .send({ status: CONTRACT_STATUS.cancelled })
          .set('Accept', 'application/json')
          .expect(422);

        expect(res.body.message).eql('Contract can only be archived');
      });

      it('should archive an aborted contract', async () => {
        const res = await request(app)
          .patch(`/contract/${contract3Id}`)
          .send({ listed: false })
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body).includes({
          ...contract3,
          status: CONTRACT_STATUS.aborted,
          listed: false,
        });

        const res2 = await request(app)
          .get(`/contract`)
          .set('Accept', 'application/json')
          .expect(200);

        expect(res2.body.contracts.length).to.eql(0);
        expect(res2.body.count).to.eql(0);
      });
    });

    describe('get archived resources', () => {
      it('should get all archived resources if requested', async () => {
        const res = await request(app)
          .get(`/contract`)
          .query({ listed: false })
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body.contracts.length).to.eql(3);
        expect(res.body.count).to.eql(3);
        expect(res.body.contracts[0].listed).to.be.false;
      });
    });
  });
});
