const { COORDINATOR_ROLES } = require('../../../server/utils/enums');
const coordinatorTeam = require('../coordinationTeam/coordinationTeam2.json');

const coordinator = {
  id: '473b092b-f226-44a7-8a4f-258b9cbe4dbb',
  stakeholder_id: '8d199594-1b7a-4eb4-808c-a7c0588d9066',
  coordinator_team_id: coordinatorTeam.id,
  role: COORDINATOR_ROLES.area_manager,
};

module.exports = coordinator;
