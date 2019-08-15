import { Address, ChainId } from "@iov/bcp";
import { BnsConnection } from "@iov/bns";

import { getConfig } from "../config";
import { getConnectionFor, isBnsSpec } from "./connection";

export type LookupResultType = Address | "name_not_found" | "no_address_for_blockchain";

/**
 * Returns the address associated with the name, or undefined if not registered.
 * The name must include a namespace ("*iov")
 */
export async function lookupRecipientAddressByName(
  username: string,
  chainId: ChainId,
): Promise<LookupResultType> {
  if (!username.endsWith("*iov")) {
    throw new Error("Username must include namespace suffix");
  }

  const config = await getConfig();
  const chains = config.chains;

  for (const chain of chains) {
    if (!isBnsSpec(chain.chainSpec)) {
      continue;
    }

    const connection = (await getConnectionFor(chain.chainSpec)) as BnsConnection;
    const usernames = await connection.getUsernames({ username });
    if (usernames.length !== 1) {
      return "name_not_found";
    }

    const chainAddressPair = usernames[0].targets.find(addr => addr.chainId === chainId);

    if (chainAddressPair) {
      return chainAddressPair.address;
    }

    return "no_address_for_blockchain";
  }

  throw new Error("No BNS connection found");
}

export function isIov(username: string): boolean {
  return username.endsWith("*iov");
}
