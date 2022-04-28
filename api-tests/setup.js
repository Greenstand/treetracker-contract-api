const sinon = require('sinon');
const s3 = require('../server/infra/S3');

let s3Stub;

before(async () => {
  s3Stub = sinon.stub(s3, 'upload').returns({
    promise: () => {
      return { Location: 'https://location.com' };
    },
  });
});

after(async () => {
  s3Stub.restore();
});
