import EIP712Domain from "eth-typed-data";
import BigNumber from "bignumber.js";
import * as ethUtil from 'ethereumjs-util';
import { ethers } from "ethers";
import axios from "axios";
import { CHAINID } from "settings";
import { ChainId } from "@usedapp/core";

/*
 * Safe relay service example
 * * * * * * * * * * * * * * * * * * * */

const gnosisEstimateTransaction = async (safe: string, tx: any): Promise<any> => {
    console.log(JSON.stringify(tx));
    try {
        const resp = await axios.post(`https://safe-relay.rinkeby.gnosis.pm/api/v2/safes/${safe}/transactions/estimate/`, tx)
        console.log(resp.data)
        return resp.data
    } catch (e) {
        //console.log(JSON.stringify(e.response.data))
        throw e
    }
}

const gnosisSubmitTx = async (safe: string, tx: any): Promise<any> => {
    try {
        const resp = await axios.post(`https://safe-relay.rinkeby.gnosis.pm/api/v1/safes/${safe}/transactions/`, tx)
        console.log(resp.data)
        return resp.data
    } catch (e) {
        //console.log(JSON.stringify(e.response.data))
        throw e
    }
}

const { utils } = ethers;

const execute = async (safe, privateKey) => {
    const safeDomain = new EIP712Domain({
        chainId: ChainId[CHAINID],
        verifyingContract: safe,
    });

    const SafeTx = safeDomain.createType('SafeTx', [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
        { type: "uint8", name: "operation" },
        { type: "uint256", name: "safeTxGas" },
        { type: "uint256", name: "baseGas" },
        { type: "uint256", name: "gasPrice" },
        { type: "address", name: "gasToken" },
        { type: "address", name: "refundReceiver" },
        { type: "uint256", name: "nonce" },
    ]);

    const to = utils.getAddress("0x0ebd146ffd9e20bf74e374e5f3a5a567a798177e");

    const baseTxn = {
        to,
        value: "1000",
        data: "0x",
        operation: "0",
    };

    console.log(JSON.stringify({ baseTxn }));

    const { safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, lastUsedNonce } = await gnosisEstimateTransaction(
        safe,
        baseTxn,
    );

    const txn = {
        ...baseTxn,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        nonce: lastUsedNonce === undefined ? 0 : lastUsedNonce + 1,
        refundReceiver: refundReceiver || "0x0000000000000000000000000000000000000000",
    };

    console.log({ txn })
    const safeTx = new SafeTx({
        ...txn,
        data: utils.arrayify(txn.data)
    });
    const signer = async data => {
        let { r, s, v } = ethUtil.ecsign(data, ethUtil.toBuffer(privateKey));
        return {
            r: new BigNumber(r.toString('hex'), 16).toString(10),
            s: new BigNumber(s.toString('hex'), 16).toString(10),
            v
        }
    }
    const signature = await safeTx.sign(signer);

    console.log({ signature });

    const toSend = {
        ...txn,
        dataGas: baseGas,
        signatures: [signature],
    };

    console.log(JSON.stringify({ toSend }));

    const { data } = await gnosisSubmitTx(safe, toSend);
    console.log({ data })
    console.log("Done?");
}

// This example uses the relay service to execute a transaction for a Safe
execute("<safe>", "<0x_signer_private_key>")

/*
 * Safe transaction service example
 * * * * * * * * * * * * * * * * * * * */

const gnosisProposeTx = async (safe: string, tx: any): Promise<any> => {
    try {
        const resp = await axios.post(`https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/${safe}/transactions/`, tx)
        console.log(resp.data)
        return resp.data
    } catch (e) {
        //if (e.response) console.log(JSON.stringify(e.response.data))
        throw e
    }
}

const submit = async (safe, sender, privateKey) => {

    const safeDomain = new EIP712Domain({
        chainId: ChainId[CHAINID],
        verifyingContract: safe,
    });

    const SafeTx = safeDomain.createType('SafeTx', [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
        { type: "uint8", name: "operation" },
        { type: "uint256", name: "safeTxGas" },
        { type: "uint256", name: "baseGas" },
        { type: "uint256", name: "gasPrice" },
        { type: "address", name: "gasToken" },
        { type: "address", name: "refundReceiver" },
        { type: "uint256", name: "nonce" },
    ]);

    const to = utils.getAddress("0x0ebd146ffd9e20bf74e374e5f3a5a567a798177e");

    const baseTxn = {
        to,
        value: "1000",
        data: "0x",
        operation: "0",
    };

    console.log(JSON.stringify({ baseTxn }));

    // Let the Safe service estimate the tx and retrieve the nonce
    const { safeTxGas, lastUsedNonce } = await gnosisEstimateTransaction(
        safe,
        baseTxn,
    );

    const txn = {
        ...baseTxn,
        safeTxGas,
        // Here we can also set any custom nonce
        nonce: lastUsedNonce === undefined ? 0 : lastUsedNonce + 1,
        // We don't want to use the refund logic of the safe to lets use the default values
        baseGas: 0,
        gasPrice: 0,
        gasToken: "0x0000000000000000000000000000000000000000",
        refundReceiver: "0x0000000000000000000000000000000000000000",
    };

    console.log({ txn })
    const safeTx = new SafeTx({
        ...txn,
        data: utils.arrayify(txn.data)
    });
    const signer = async data => {
        let { r, s, v } = ethUtil.ecsign(data, ethUtil.toBuffer(privateKey));
        return ethUtil.toRpcSig(v, r, s)
    }
    const signature = await safeTx.sign(signer);

    console.log({ signature });

    const toSend = {
        ...txn,
        sender,
        contractTransactionHash: "0x" + safeTx.signHash().toString('hex'),
        signature: signature,
    };

    console.log(JSON.stringify({ toSend }));

    const { data } = await gnosisProposeTx(safe, toSend);
    console.log({ data })
    console.log("Done?");
}

// This example uses the transaction service to propose a transaction to the Safe Multisig interface
submit("<safe>", "<0x_signer_address>", "<0x_signer_private_key>")