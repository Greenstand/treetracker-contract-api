const { AGREEMENT_TYPE } = require('../../../server/utils/enums');
const coordinationTeam = require('../coordinationTeam/coordinationTeam2.json');
const speciesAgreement = require('../speciesAgreement/speciesAgreement2.json');
const consolidationRule = require('../consolidationRule/consolidationRule2.json');

const agreement = {
  id: '79cb45f4-3e38-4611-8431-ab44a1796c98',
  type: AGREEMENT_TYPE.village_champion,
  owner_id: '490d0f77-13ea-4a37-b860-0e542b6dce94',
  funder_id: '298ecd91-acd0-4d19-b00c-782527fbd7fa',
  growing_organization_id: '4eac93fe-488b-47b2-bdea-c71ce9889dc3',
  coordination_team_id: coordinationTeam.id,
  species_agreement_id: speciesAgreement.id,
  consolidation_rule_id: consolidationRule.id,
  name: 'agreement 2',
  description: 'agreement 2',
  max_captures: 50,
};

module.exports = agreement;
