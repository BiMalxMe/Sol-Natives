import {
  Connection, Keypair , LAMPORTS_PER_SOL, PublicKey , SystemProgram,
  Transaction,
} from "@solana/web3.js";
import * as borsh from "borsh"
import { expect, test } from "bun:test";
import { ContractSize, schema } from "./types";

const programId = new PublicKey("7WoF16xx6VdAhuFLVT4ggbQzNnJ7FA3MkFQQnLmQTTvM");
let adminAccount = Keypair.generate();
let dataAccount = Keypair.generate();
test("Account Initalized", async () => {
  const connection = new Connection("http://127.0.0.1:8899");
  const tx = await connection.requestAirdrop(
    adminAccount.publicKey,
    10 * LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(tx);

  const lamports = await connection.getMinimumBalanceForRentExemption(
    ContractSize
  );
  const instruction = SystemProgram.createAccount({
    fromPubkey: adminAccount.publicKey,
    lamports,
    space: ContractSize,
    programId,
    newAccountPubkey : dataAccount.publicKey
  });

  const creationOfAccountTx = new Transaction();
    creationOfAccountTx.add(instruction);

const sig =await connection.sendTransaction(creationOfAccountTx,[adminAccount,dataAccount])
await connection.confirmTransaction(sig)
const dataAccountInfi = await connection.getAccountInfo(dataAccount.publicKey);
console.log(dataAccountInfi?.data)
const currentCount = borsh.deserialize(schema,dataAccountInfi?.data);
// Reading from the deployed smart contract
expect(currentCount.count).toBe(0);
});
