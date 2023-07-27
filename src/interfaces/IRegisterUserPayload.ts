export interface IRegisterUserPayload {
  username: string;
  starkKey: string;
  starkSignature: { r: string; s: string };
  address: string;
  eip712Signature: string;
}
