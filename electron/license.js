const fs = require('fs');
const os = require('os');
const crypto = require('crypto');

function machineId() {
  return crypto.createHash('sha256').update(os.hostname()).digest('hex');
}

function validateLicense(key) {
  return key === machineId().slice(0, 16);
}

module.exports = { validateLicense };
