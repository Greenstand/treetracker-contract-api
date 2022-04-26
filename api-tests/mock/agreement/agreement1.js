const { CURRENCY, AGREEMENT_TYPE } = require('../../../server/utils/enums');
const consolidationRule = require('../consolidationRule/consolidationRule2.json');
const coordinationTeam = require('../coordinationTeam/coordinationTeam2.json');

const agreement = {
  type: AGREEMENT_TYPE.grower,
  owner_id: '10092c79-9458-4ba0-a50c-089df6d708cb',
  funder_id: '5e541862-5ebb-4860-b910-cca8a675ae31',
  coordination_team_id: coordinationTeam.id,
  consolidation_rule_id: consolidationRule.id,
  name: 'agreement 1',
  description: 'agreement 1',
  capture_payment: '250',
  capture_payment_currency: CURRENCY.SLL,
  max_captures: 21,
};

module.exports = agreement;
