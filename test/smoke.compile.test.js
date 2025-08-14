const { expect } = require('chai');
const hre = require('hardhat');

describe('Project smoke', function () {
  it('compiles the contracts', async function () {
    await hre.run('compile');
    expect(true).to.equal(true);
  });
});
