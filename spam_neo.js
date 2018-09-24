const api =  require('@cityofzion/neon-js');
const fs = require('fs');


// Take file with single column and convert to array
const fileToArray = function(file) {
    var arr = fs.readFileSync(file, "utf-8").split("\n");
    arr.splice(-1, 1);
    return arr;
}

// List of public neo nodes
var urls = fileToArray("./node_list.txt");

// List of contract script hashes
var script_hashes = fileToArray("./script_hashes.txt");

// List of random NEO addresses
var address_list = fileToArray("./address_list.txt");

// Nep-5 methods
operations = ['totalSupply', 'name', 'symbol', 'decimals', 'balanceOf', 'transfer']

// Check response from RPC
const verifyInvokeResponse = function(res) {
    return res.response.result;
}

// Simple sleep promise
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Need to pass hex strings for wallet addresses
const getHexAddress = function(addr) {
    return api.u.reverseHex(api.wallet.getScriptHashFromAddress(addr))
}

// Just invoke spam_neo function in a loop
// which creates tons of junk txs on the neo
// blockchain for free
spamNeo = async(runs) => {

    for (let nonce = 1; nonce <= runs; nonce++) {

      // Make uniquite private key / address pair invoking each
      // free transaction. No spam is tied to a certain address
      const privateKey = api.wallet.generatePrivateKey();
      const publicKey = api.wallet.getPublicKeyFromPrivateKey(privateKey);
      const scriptHash = api.wallet.getScriptHashFromPublicKey(publicKey);
      const address = api.wallet.getAddressFromScriptHash(scriptHash);
      
      // Config for doInvoke function
      const config = {
        net: 'MainNet',
        privateKey: privateKey,
        address: address,
        gas: 0
      }

      // Submit transaction to random NEO node
      config.url = urls[nonce % urls.length]
      
      var script = {};
      script.scriptHash = script_hashes[nonce % script_hashes.length];
      script.operation = operations[nonce % operations.length];
      if (script.operation === 'balanceOf') {
        script.args = [getHexAddress(address_list[nonce % address_list.length])]
      } else if (script.operation === 'transfer') {
        script.args = [getHexAddress(address_list[nonce % address_list.length]),
                         getHexAddress(address_list[(nonce+1) % address_list.length]),
                         0]
      } else {
        script.args = []
      }
      
      config.script = script


      //console.info("Invoke Config: " + JSON.stringify(config, null, 4));

      api.api.doInvoke(config).then( (res) => {
 
          //console.info("Respones is: " + JSON.stringify(res));

          let success = verifyInvokeResponse(res)
          if (!success) {
            console.info("FAILED " + JSON.stringify(res.response));
          } else {
            console.info("Successful Invoke...");
          }
        }).catch( (e) => {
          console.error("Failed Invoke: " + e);
        });
        
        // sleep between calls to meter tx submissions
        await sleep(10);
    }

    return true;
}

// And call it
spamNeo(100);
