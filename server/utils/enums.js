module.exports = {
  CONTRACT_STATUS: {
    // unsigned: 'unsigned', // db insert default
    signed: 'signed',
    cancelled: 'cancelled',
    completed: 'completed',
  },

  COORDINATOR_ROLES: {
    supervisor: 'supervisor',
    area_manager: 'area_manager',
  },

  CURRENCY: {
    USD: 'USD',
    SLL: 'SLL',
  },

  AGREEMENT_STATUS: {
    // planning: 'planning', // db insert default
    open: 'open',
    closed: 'closed',
    aborted: 'aborted',
  },

  AGREEMENT_TYPE: {
    grower: 'grower',
    nursury: 'nursury',
    village_champion: 'village_champion',
  },

  SPECIES_TYPE: {
    other: 'other',
    any: 'any',
    specific: 'specific',
    genus: 'genus',
  },
};
