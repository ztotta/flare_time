'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

/*
  Use at your own discretion. This program is provided on a voluntary and best 
  effort basis. If you want to examine the RippleAPI methods used in this program, 
  see https://xrpl.org/rippleapi-reference.html
  
  To install, run `npm i` within this folder, follow the instructions, then 
  execute the program by running `node flare_time.js` from the root of this folder.
 */

// The official XRPL domain:
const serverDomain = 'wss://s1.ripple.com/';

// The XRPL test-net. Generate a test net wallet and construct the RippleAPI below 
// with testServerDomain if you want to test this flow first:
const testServerDomain = 'wss://s.altnet.rippletest.net:51233'

const api = new RippleAPI({
  server: serverDomain
});

// Replace these values with your wallet's public and private keys:
const wallet_public_key = "?";
const wallet_private_key = "?";

// Generate a flare address from an ETH address by following instructions here:
// -> https://flare.wietse.com/

// Replace this value with your generated flare address:
const flare_address = "?";

console.log("\nAbout to connect to XRPL...");

return api.connect().then(() => {

  console.log("\nConnected to XRPL...");
  
  const isValid = api.isValidAddress(wallet_public_key);
 
  console.log("\nWallet address is valid: " + isValid);
  
  api.getAccountInfo(wallet_public_key)
  .then(info => {
    console.log("\nAccountInfo: " + JSON.stringify(info));
    return;
  });

  const settings = {
    "messageKey": flare_address
  };

  // This sets the MessageKey value of your wallet's Settings, which is required
  // for Flare to connect your XRP and ETH wallets for the Flare airdrop:
  return api.prepareSettings(wallet_public_key, settings)
  .then(preparedSettings => {
    console.log("\npreparedSettings: " + JSON.stringify(preparedSettings));
    
    console.log("\nAbout to sign transaction...");

    const response = api.sign(preparedSettings.txJSON, wallet_private_key);

    console.log("\nSuccessfully signed transaction: " + JSON.stringify(response));

    return api.submit(response.signedTransaction);
  })
  .catch(e => {
    console.log("\nError: " + e);
    return;
  })
  .then(() => {
    return api.getSettings(wallet_public_key)
    .then(settings => {
      console.log("\nSettings: " + JSON.stringify(settings));
    })
  })
})
.then(() => {
  console.log("\nAbout to disconnect from XRPL...");
  return api.disconnect();
}).then(() => {
  console.log("\nDisconnected from XRPL.");
});

// Search for your wallet by public key at https://xrpscan.com/
// Verify that "Flare address" is present under the Account Summary section.
