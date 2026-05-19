const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateRegistry", function () {
  let registry;
  let owner;
  let other;

  const certId = "BC-TEST-0001";
  const certHash = "abc123hash";

  beforeEach(async () => {
    [owner, other] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("CertificateRegistry");
    registry = await Registry.deploy();
    await registry.waitForDeployment();
  });

  it("issues and verifies certificate", async () => {
    await registry.issueCertificate(certId, certHash);
    const valid = await registry.verifyCertificate(certId, certHash);
    expect(valid).to.equal(true);
  });

  it("revokes certificate", async () => {
    await registry.issueCertificate(certId, certHash);
    await registry.revokeCertificate(certId);
    const valid = await registry.verifyCertificate(certId, certHash);
    expect(valid).to.equal(false);
  });

  it("prevents non-owner from issuing", async () => {
    await expect(registry.connect(other).issueCertificate(certId, certHash)).to.be.revertedWith(
      "Only owner can perform this action"
    );
  });
});
