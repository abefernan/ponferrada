import { singleton } from "ui-logic";

import developmentConfig from "./development.json";

export interface Config {
  readonly extensionId: string;
  readonly bnsChain: ChainConfig;
}

export interface ChainConfig {
  readonly chainSpec: ChainSpec;
  readonly guaranteeFundEscrowId?: number;
  readonly rewardFundAddress?: string;
}

export interface ChainSpec {
  readonly node: string;
  readonly name: string;
  readonly chainId: string;
  readonly scraper?: string;
}

interface WindowWithConfig extends Window {
  readonly developmentConfig: Config;
}

function getWindowWithConfig(): WindowWithConfig {
  return (window as Window) as WindowWithConfig;
}

const loadConfigurationFile = async (): Promise<Config> => {
  if (process.env.NODE_ENV === "test") {
    return getWindowWithConfig().developmentConfig;
  }

  if (process.env.NODE_ENV === "development") {
    // This is the `yarn start` case. Only the development config is supported here.
    // If you need to use a different configuration, use yarn build + docker build + docker run.
    return developmentConfig;
  }

  const response = await fetch("/config/conf.json");
  if (!response.ok) {
    throw new Error(`Failed to fetch URL. Response status code: ${response.status}`);
  }

  const json = await response.json();
  return json;
};

export const getConfig = singleton<typeof loadConfigurationFile>(loadConfigurationFile);
