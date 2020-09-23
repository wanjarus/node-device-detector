const parseAst = require('regexp-tree');
const DeviceDetector = require('../index');
const util = require('util');


const detector = new DeviceDetector({skipBotDetection: false});
/*
let tree = {};
for (let name in detector.deviceParserList) {
  let parser = detector.deviceParserList[name];
  let parserName = name;
  if (!tree[parserName]) {
	tree[parserName] = {};
  }
  for (let brand in parser.collection) {
	let regexStr = parser.collection[brand].regex;
	regexStr = regexStr.replace(new RegExp('/', 'g'), '\\/');
	regexStr = regexStr.replace(new RegExp('\\+\\+', 'g'), '+');
	
	
	if (!tree[parserName][brand]) {
	  tree[parserName][brand] = {};
	}

	tree[parserName][brand]['source'] = regexStr;
	try {
	  let ast = parseAst.parse(`/${regexStr}/i`, {  captureLocations: true});
	  tree[parserName][brand]['ast'] = ast;

	} catch (e) {
	  console.error(regexStr, e.message)
	}
  }
}*/
regexStr = '(HW-)?(?:Huawei|MediaPad T1|Ideos|Honor[ _]?|(?:(?:AGS|AGS2|ALE|ALP|AMN|ANE|ARE|ARS|ASK|ATH|ATU|AUM|BAC|BAH[23]?|BG2|BGO|B[ZK]K|BKL|BL[ALN]|BND|BTV|CA[GMNZ]|CH[CM]|CHE[12]?|CLT|CMR|COL|COR|CPN|CRO|CRR|CUN|DIG|DLI|DRA|DUA|DUB|DUK|EDI|ELE|EML|EVA|EVR|FDR|FIG|FLA|FRD|GEM|GRA|HDN|HLK|HMA|Hol|HRY|HWI|H[36]0|INE|JAT|JDN|JDN2|JKM|JMM|JSN|KII|KIW|KNT|KOB|KSA|LDN|LEO|LIO|LLD|LND|LON|LRA|LUA|LY[AO]|MAR|MHA|MRD|MYA|NCE|NEM|NEO|NXT|PAR|PCT|PIC|PLE|PLK|POT|PRA|RIO|RNE|RVL|SCC|SCL|SCM|SEA|SHT|SLA|SNE|SPN|STF|STK|TAG|TIT|TNY|TRT|VCE|VEN|VIE|VKY|VNS|VOG|VRD|VTR|WAS|YAL|G(?:527|620S|621|630|735)|Y(?:221|330|550|6[23]5))-(?:[A-Z]{0,2}[0-9]{1,4}[A-Z]{0,3}?)|H1711|U(?:8230|8500|8661|8665|8667|8800|8818|8860|9200|9508))[);\/ ])|hi6210sft|PE-(UL00|TL[12]0|TL00M)|T1-(A21[Lw]|A23L|701u|823L)|G7-(?:L01|TL00)|HW-01K|JNY-(LX[12]|AL10)|OXF-AN[01]0|TAS-(A[LN]00|L29|TL00)|WLZ-(AL10|AN00)|NIC-LX1A|MRX-(AL09|W09)|CDY-([AT]N00|AN90)|GLK-[AT]L00|JER-[AT]N10|ELS-(?:[AT]N00|NX9)|AKA-(AL10|L29)|MON-(W|AL)19|BMH-AN[12]0|AQM-([AT]L[01]0|LX1)|MOA-(AL00|LX9N)|NTS-AL00|ART-[AT]L00[xm]|JEF-[AT]N00|MED-[AT]L00|EBG-AN[01]0|ANA-[AT]N00|BZ[AK]-W00|BZT-(W09|AL[01]0)|HDL-(AL09|W09)|HWV3[123]|HW-02L|TEL-AN00a?|TAH-AN00m|C8817D|T1-821W|d-01J|d-02[HK]|HWT31|Y320-U10|Y541-U02'
// tree = parseAst.parse(regexStr, {  });
/*
let tree = regexStr.split('|');
for (let i = 0; i < tree.length; i++) {
  tree[i] = tree[i].split(')');
}*/

const RandExp = require('randexp');
RandExp.sugar();
let ss = new RandExp(`${regexStr}`);
let result = [];
let i = 0;
while(true){
  let id = ss.gen();
  if(!result.includes(id)){
	result.push(id);
	console.log(id);
  }

  if ( i > 10000000) {
	break;
  }
  i++;
}





// function getWords(ast, words = []){
// 	if(ast.type === 'RegExp'){
// 	  let expressions = ast.body.expressions;
// 	  for(let i=0, l = expressions.length; i <l; i++){
//
// 	  }
// 	}
// 	if(!ast){
// 	  return words;
// 	}
//
// }

//0console.log( util.inspect(result, {showHidden: true, depth: 5}));
