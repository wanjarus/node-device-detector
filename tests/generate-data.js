const https = require('https');

const util = require('util')
const readline = require('readline')
const stream = require('stream')
const rename = util.promisify(fs.rename)
const unlink = util.promisify(fs.unlink)

const detector = require('../index');
const alias = require('../parser/device/alias-device')

const FIXTURE_FOLDER = __dirname + '/fixtures/';
const DATA_FILE = __dirname + '/../data/data.txt';
const TEST_EXCLUDES = ['alias_devices.yml', 'bots.yml'];

/**
 * @param {string} yamlPath
 * @returns {any}
 * @constructor
 */
function YAMLLoad(yamlPath) {
  return YAML.safeLoad(fs.readFileSync(yamlPath, 'utf8'));
}

function arrayDiff(a, b) {
  return [...a.filter(x => !b.includes(x)), ...b.filter(x => !a.includes(x))];
}

/**
 * @author https://github.com/codealchemist/line-replace
 *
 **/
function lineReplace({file, line, text, addNewLine = true, callback}) {
  const readStream = fs.createReadStream(file)
  const tempFile = `${file}.tmp`
  const writeStream = fs.createWriteStream(tempFile)
  const rl = readline.createInterface(readStream, stream)
  let replacedText
  
  readStream.on('error', async ({message}) => {
	await unlink(tempFile)
	callback({error: message, file, line, replacedText, text})
  })
  
  writeStream.on('error', async ({message}) => {
	await unlink(tempFile)
	callback({error: message, file, line, replacedText, text})
  })
  
  rl.on('error', async ({message}) => {
	await unlink(tempFile)
	callback({error: message, file, line, replacedText, text})
  })
  
  let currentLine = 0
  rl.on('line', (originalLine) => {
	++currentLine
	
	// Replace.
	if (currentLine === line) {
	  replacedText = originalLine
	  if (addNewLine) return writeStream.write(`${text}\n`)
	  return writeStream.write(`${text}`)
	}
	
	// Save original line.
	writeStream.write(`${originalLine}\n`)
  })
  
  rl.on('close', () => {
	// Finish writing to temp file and replace files.
	// Replace original file with fixed file (the temp file).
	writeStream.end(async () => {
	  try {
		await unlink(file) // Delete original file.
		await rename(tempFile, file) // Rename temp file with original file name.
	  } catch (error) {
		callback({error, file, line, replacedText, text})
		return
	  }
	  callback({file, line, replacedText, text})
	})
  })
}

function find({brand, model, codes, type = 'smartphone'}) {
  return new Promise((resolve, reject) => {
	const readStream = fs.createReadStream(DATA_FILE)
	const rl = readline.createInterface(readStream, stream)
	let position = 0
	rl.on('line', (line) => {
	  ++position;
	  let data = JSON.parse(line);
	  if (data !== null) {
		if (!data || data.brand !== undefined && data.brand !== brand) {
		  return;
		}
		
		let result = Object.assign({}, data);
		for (let key in data.models) {
		  // обновление модели
		  if (key === model) {
			let newCodes = arrayDiff(result.models[key].codes, codes);
			newCodes = arrayDiff([key], newCodes);
			if (newCodes.length > 0) {
			  newCodes.forEach((code) => {
				result.models[key].codes.push(code);
			  })
			  resolve({result, position, update: true})
			  rl.close();
			  return;
			}
			resolve({result, position, update: false})
			rl.close();
			return;
		  }
		}
		// новая модель
		result.models[model] = {};
		result.models[model].codes = codes;
		resolve({result, position, update: true})
		rl.close();
		return;
	  }
	})
	rl.on('end', () => {
	  resolve(false);
	});
  })
}

function push({brand, model, codes = [], type = 'smartphone'}) {
  return new Promise((resolve, reject) => {
	find({brand, model, codes, type}).then((result) => {
	  //  новая запись
	  if (result === false) {
		let data = {brand};
		data.models = {};
		data.models[model] = {};
		data.models[model].codes = codes;
		fs.appendFileSync(DATA_FILE, JSON.stringify(data) + "\n");
	  }
	  // обновление
	  if (result.update) {
		lineReplace({
		  file: DATA_FILE,
		  line: result.position,
		  text: JSON.stringify(result.result), addNewLine: true, callback: () => {
			resolve();
		  }
		});
	  }
	  
	})
  })
  //  result = aliasDevice.parse(fixture.user_agent);
}


ymlDeviceFiles = fs.readdirSync(FIXTURE_FOLDER + 'devices/');

// each brands in detector
ymlDeviceFiles.forEach((filename) => {
  if (TEST_EXCLUDES.includes(filename)) {
	return;
  }
  console.log(filename);
});

const SERVICE = '';

// https://storage.googleapis.com/play_public/supported_devices.csv

//'s/^\(\s*my_field\s*:\s*\).*/\1new-value/'