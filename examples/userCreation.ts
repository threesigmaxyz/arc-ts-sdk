/* eslint-disable @typescript-eslint/no-var-requires */

import fetch from 'node-fetch';
const starkwareCrypto = require('@starkware-industries/starkware-crypto-utils');
import {
  MessageTypes,
  SignTypedDataVersion,
  TypedMessage,
  signTypedData,
} from "@metamask/eth-sig-util";

import {ethers} from "ethers";

const JSON_RPC_URL = "https://testnet-api.starkexpress.io/api/v1";
const WALLET_ADDRESS = "0x772094abC0743D066316565D7FD7a396dfDEe811";
const WALLET_PRIVATE_KEY = "0x2c432d7e0c162bdd50bb0813cd0c1ab847360d67129952b9beed3de8a129354d";
const X_API_KEY = 'MGE1MDg0YWItN2JkYS00MTZjLWFmMTUtZTdjYWJiZmI2NDk0O0V2Z2VuaQ==.cHH8TAFpriNzvurcpjOzO-nfOir9IbBv';
const USERNAME = "evgenipirianov";

// https://eips.ethereum.org/EIPS/eip-712#definition-of-domainseparator
// https://eips.ethereum.org/EIPS/eip-712
// https://github.com/ethers-io/ethers.js/discussions/2835
// https://github.com/danfinlay/js-eth-personal-sign-examples/blob/master/index.js
// https://github.com/MetaMask/test-dapp/blob/main/src/index.js#L365
// https://github.com/starkware-libs/starkware-crypto-utils/blob/098479d05363070ab901e9492db425555b8b0898/test/js/signature.spec.ts

// ================================================================== //
interface IEIP712SignableDataUrlParams {
    username: string;
    starkKey: string;
    address: string;
}

const getEIP712SignableData = async <T extends MessageTypes>(queryParams: IEIP712SignableDataUrlParams): Promise<TypedMessage<T>> => {
  const query = new URLSearchParams({
    username: queryParams.username,
    stark_key: queryParams.starkKey,
    address: queryParams.address,
  }).toString();
    
    
  const resp = await fetch(
    `${JSON_RPC_URL}/users/register-details?${query}`,
    {
      method: 'GET',
      headers: {
        'x-api-key': X_API_KEY
      }
    }
  );
        
  const data = await resp.json();
  return data;
};


// ================================================================== //
interface IRegisterUserPayload {
    username: string;
    starkKey: string;
    starkSignature: {r: string; s: string;};
    address: string;
    eip712Signature: string;
}


const registerNewUser = async (body: IRegisterUserPayload): Promise<any> => {
  const resp = await fetch(
    `${JSON_RPC_URL}/users`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': X_API_KEY
      },
      body: JSON.stringify(body)
    }
  );
  const data = await resp.json();
  return data;
};

// main.ts
(async () => {

  const keyPair = starkwareCrypto.ec.keyFromPrivate(WALLET_PRIVATE_KEY.substring(2), 'hex');
  const _starkPublicKey = keyPair.getPublic(true, 'hex');
  const starkPrivateKey = keyPair.getPrivate('hex');
  console.log("STARK PRIVATE KEY: ",starkPrivateKey);
  console.log("STARK PUBLIC KEY: ", _starkPublicKey);

  // const keyPairPub = ec.keyFromPublic(keyPair.getPublic(), 'BN');
  const keyPairPub = starkwareCrypto.ec.keyFromPublic(
    keyPair.getPublic(true, 'hex'),
    'hex'
  );
  // console.log("PUB KEY PAIR ", publicKey);
  const publicKeyX = keyPairPub.getPublic().getX(); // publicKey.pub.getX() // .toString('hex');
  console.log("PUB KEY X ", publicKeyX.toJSON(), publicKeyX.toString('hex'), publicKeyX.toString(16));
  const starkPublicKey: string = publicKeyX.toString(16);

  // ========================= get register details =========================
  const register_details: TypedMessage<MessageTypes> = await getEIP712SignableData({username: USERNAME, starkKey: starkPublicKey, address: WALLET_ADDRESS} as IEIP712SignableDataUrlParams);
  console.log("REGISTER DETAILS ", register_details);

  //  ========================= sign_eip712_register_message ===============================

  // +++++++++++++++METAMASK++++++++++++++++++ //
  const ethereumPrivateKeyHex = Buffer.from(
    WALLET_PRIVATE_KEY.substring(2),
    "hex"
  );

  const messageParams: Record<string, unknown> = {
    "username": (register_details.message[0] as object)["value"],
    "address": (register_details["message"][2] as object)["value"],
    "starkKey": (register_details["message"][1] as object)["value"].substring(2),
  };

  const data = {
    domain: register_details.domain,
    types: register_details.types,
    primaryType: register_details.primaryType,
    message: messageParams
  };
  console.log("XXXXXXXXXXXX ", data);
  data.domain.chainId = 5 as number;
  console.log("HHHHHHHHHHHHHHHHHHH ", register_details.domain);
  console.log("HHHHHHHHHHHHHHHHHHH ", register_details.types.EIP712Domain);
  console.log("HHHHHHHHHHHHHHHHHHH ", register_details.types['User']);

  const eip712SignatureMetamask: string = signTypedData({
    privateKey: ethereumPrivateKeyHex,
    data: data,
    version: SignTypedDataVersion.V4,
  });
  console.log("eip712_signature (Metamask) = ", eip712SignatureMetamask);


  // +++++++++++++++ETHERS.JS++++++++++++++++++ //
  // https://docs.ethers.org/v5/api/signer/
  const provider = new ethers.InfuraProvider("goerli", "b5c6e30b9ec54ff7a6befbf8d7f62af7");
  // const provider = new ethers.AlchemyProvider("goerli", "oc9fpoS3KV_p-8KnSowZEVfN8CG_PqkL");
  const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
  const types = { 
    "User": [
      { name: 'username', type: 'string' },
      { name: 'starkKey', type: 'string' },
      { name: 'address', type: 'string' }
    ],
  };
  const values = {
    username: messageParams['username'],
    starkKey: messageParams['starkKey'],
    address: messageParams['address'],
  };
  console.log("############## Domain", data.domain);
  console.log("############## Types", types);
  console.log("############## Values", values);

  const eip712SignatureEthers = await wallet.signTypedData(
    data.domain as ethers.TypedDataDomain,
    types,
    values);
  console.log("eip712_signature (Ethers) = ", eip712SignatureEthers);

  // ========================= Sign the Ethereum address => create stark signature =========================
  const starkSignature = starkwareCrypto.sign(keyPair, starkwareCrypto.pedersen([WALLET_ADDRESS.substring(2)]));
  const r = starkSignature.r.toString('hex');
  const s = starkSignature.s.toString('hex');
  console.log(r);
  console.log(s);

  // ========================= register the user =========================
  const registerationPayload = {
    username: USERNAME,
    address: WALLET_ADDRESS,
    eip712Signature: eip712SignatureEthers,
    starkKey: starkPublicKey,
    starkSignature: {r, s},
  } as IRegisterUserPayload;
  console.log("PAYLOAD", registerationPayload);

  const response = await registerNewUser({
    username: USERNAME,
    address: WALLET_ADDRESS,
    eip712Signature: eip712SignatureEthers,
    starkKey: starkPublicKey,
    starkSignature: {r, s},
  } as IRegisterUserPayload);

  console.log("RRRRRRRRRRR", response);
})();

