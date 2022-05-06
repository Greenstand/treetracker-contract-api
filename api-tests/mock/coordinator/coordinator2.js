const { COORDINATOR_ROLES } = require('../../../server/utils/enums');
const reportsToCoordinator = require('./coordinator3');

const coordinator = {
  id: '69f882e6-7618-4c65-befb-76528fd605f9',
  stakeholder_id: 'f7e1719f-4096-45e1-a4ca-c94f8ad5db0b',
  coordinator_team_id: reportsToCoordinator.coordinator_team_id,
  coordinator_id: reportsToCoordinator.id,
  role: COORDINATOR_ROLES.supervisor,
};

module.exports = coordinator;
