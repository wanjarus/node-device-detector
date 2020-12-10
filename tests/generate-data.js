const https = require('https');
const http = require('http');

const fs = require('fs');
const util = require('util')
const readline = require('readline');
const YAML = require('js-yaml');

const DeviceDetector = require('../index');
const DeviceAlias = require('../parser/device/alias-device');

const FIXTURE_FOLDER = __dirname + '/fixtures';
const DATA_FILE = __dirname + '/../data/data.txt';
const TEST_EXCLUDES = ['alias_devices.yml', 'bots.yml'];

/**
 * @param {string} yamlPath
 * @returns {any}
 * @constructor
 */
function ymlLoad(yamlPath) {
  return YAML.safeLoad(fs.readFileSync(yamlPath, 'utf8'));
}

const detector = new DeviceDetector;
const alias = new DeviceAlias;


let DATA = {};

if (!fs.existsSync(DATA_FILE)) {
  fs.closeSync(fs.openSync(DATA_FILE, 'w'))
} else {
  DATA = JSON.parse(fs.readFileSync(DATA_FILE));
  if (DATA === null) {
	DATA = {};
  }
}

const request = function (url) {
  return new Promise((resolve, reject) => {
	const lib = url.startsWith('https') ? https : http;
	const request = lib.get(url, (response) => {
	  if (response.statusCode < 200 || response.statusCode > 299) {
		reject(new Error('Failed to load page, status code: ' + response.statusCode));
	  }
	  const body = [];
	  response.on('data', (chunk) => body.push(chunk));
	  response.on('end', () => resolve(body.join('')));
	});
	request.on('error', (err) => reject(err))
  })
};

function push(brand, model, codes = []) {
  if (DATA[brand] === void 0) {
	DATA[brand] = {};
	DATA[brand]['models'] = {};
  }
  if (DATA[brand]['models'][model] === void 0) {
	DATA[brand]['models'][model] = {};
	DATA[brand]['models'][model].codes = codes;
  }
  let oldCodes = DATA[brand]['models'][model].codes;
  DATA[brand]['models'][model].codes = [...new Set([...oldCodes, ...codes])];
}

// генерация из тестов

let ymlDeviceFiles = fs.readdirSync(FIXTURE_FOLDER + '/devices/');
for (let i = 0, l = ymlDeviceFiles.length; i < l; i++) {
  let filename = ymlDeviceFiles[i];
  if (TEST_EXCLUDES.includes(filename)) {
	continue;
  }
  let fixtures = ymlLoad(FIXTURE_FOLDER + '/devices/' + filename);
  for (let fixture of fixtures) {
	if (!fixture.device || !fixture.device.brand || !fixture.device.model) {
	  continue;
	}
	let device = fixture.device;
	let codes = [];
	let result = alias.parse(fixture.user_agent);
	if (result.name) {
	  codes.push(result.name);
	}
	push(device.brand, device.model, codes);
  }
}

fs.writeFileSync(DATA_FILE, JSON.stringify(DATA, null, 2), {encoding: 'utf8', flag: 'w'});


// https://storage.googleapis.com/play_public/supported_devices.csv

//'s/^\(\s*my_field\s*:\s*\).*/\1new-value/'