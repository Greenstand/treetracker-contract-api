const speciesAgreement = require('../speciesAgreement/speciesAgreement2.json');
const { SPECIES_TYPE, CURRENCY } = require('../../../server/utils/enums');

const speciesPayout = {
  species_agreement_id: speciesAgreement.id,
  type: SPECIES_TYPE.other,
  scientific_name: 'Quercus alba',
  species_id: '00c3bf5f-fbf2-4433-a350-410e3bd0034b',
  payment: '100',
  payment_currency: CURRENCY.SLL,
};

module.exports = speciesPayout;
