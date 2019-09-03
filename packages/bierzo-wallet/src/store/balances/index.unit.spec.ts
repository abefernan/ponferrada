import { parseGetIdentitiesResponse } from "../../communication/identities";
import * as identities from "../../communication/identities";
import { disconnect } from "../../logic/connection";
import { getExtensionStatus } from "../../logic/extension";
import { aNewStore } from "../../store";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { setExtensionStateAction } from "../extension";
import { addBalancesAction, getBalances } from "./actions";

withChainsDescribe("Tokens reducer", () => {
  afterAll(() => disconnect());

  it("has correct initial state", async () => {
    const store = aNewStore();
    const balances = store.getState().balances;
    expect(balances).toEqual({});
  });

  it("dispatches correctly addBalances action", async () => {
    const store = aNewStore();
    const ethResponse = {
      jsonrpc: "2.0",
      id: 1,
      result: [
        {
          chainId: "string:ethereum-eip155-5777",
          pubkey: {
            algo: "string:secp256k1",
            data:
              "bytes:04965fb72aad79318cd8c8c975cf18fa8bcac0c091605d10e89cd5a9f7cff564b0cb0459a7c22903119f7a42947c32c1cc6a434a86f0e26aad00ca2b2aff6ba381",
          },
        },
      ],
    };

    const identitiesResponse = parseGetIdentitiesResponse(ethResponse);
    jest.spyOn(identities, "sendGetIdentitiesRequest").mockResolvedValueOnce(identitiesResponse);

    const extension = await getExtensionStatus();
    store.dispatch(setExtensionStateAction(extension.connected, extension.installed, extension.identities));

    const keys = store.getState().extension.identities;
    const tokens = await getBalances(keys);
    store.dispatch(addBalancesAction(tokens));

    const balances = store.getState().balances;
    expect(balances.ETH).toBeDefined();
    expect(balances.ETH.fractionalDigits).toEqual(18);
    expect(balances.ETH.quantity).toMatch(/^[0-9]{10,22}$/);
    expect(balances.ETH.tokenTicker).toEqual("ETH");
  });
});
