import { ChainId, Identity, isIdentity } from "@iov/bcp";
import { TransactionEncoder } from "@iov/encoding";
import { isJsonRpcErrorResponse, JsonRpcRequest, makeJsonRpcId, parseJsonRpcResponse } from "@iov/jsonrpc";

import { browserExtensionErrorCodes, GetIdentitiesResponse } from "..";
import { getConfig } from "../../config";
import { getBnsConnection } from "../../logic/connection";

export const generateGetIdentitiesRequest = (bnsChainId: ChainId): JsonRpcRequest => ({
  jsonrpc: "2.0",
  id: makeJsonRpcId(),
  method: "getIdentities",
  params: {
    reason: TransactionEncoder.toJson("I would like to know who you are on IOV Name Service"),
    chainIds: TransactionEncoder.toJson([bnsChainId]),
  },
});

const isArrayOfIdentity = (data: any): data is readonly Identity[] => {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(isIdentity);
};

function isExtensionContext(): boolean {
  return (
    typeof chrome !== "undefined" &&
    typeof chrome.runtime !== "undefined" &&
    typeof chrome.runtime.sendMessage !== "undefined"
  );
}

/**
 * @returns a response or `undefined` if the endpoint was not available
 */
export const sendGetIdentitiesRequest = async (): Promise<
  GetIdentitiesResponse | undefined | "not_ready"
> => {
  if (!isExtensionContext()) return undefined;

  const connection = await getBnsConnection();

  const request = generateGetIdentitiesRequest(connection.chainId);

  const config = await getConfig();

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(config.extensionId, request, response => {
      if (chrome.runtime.lastError) {
        resolve(undefined);
        return;
      }

      try {
        const parsedResponse = parseJsonRpcResponse(response);
        if (isJsonRpcErrorResponse(parsedResponse)) {
          switch (parsedResponse.error.code) {
            case browserExtensionErrorCodes.signingServerNotReady:
              resolve("not_ready");
              return;
            default:
              reject(parsedResponse.error.message);
              return;
          }
        }

        const parsedResult = TransactionEncoder.fromJson(parsedResponse.result);
        if (!isArrayOfIdentity(parsedResult)) {
          reject("Got unexpected type of result");
          return;
        }

        resolve(parsedResult);
      } catch (error) {
        reject(error);
      }
    });
  });
};
