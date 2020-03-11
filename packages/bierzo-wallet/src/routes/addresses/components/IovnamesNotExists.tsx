import { Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, Typography } from "medulas-react-components";
import React from "react";

import { RpcEndpointType } from "../../../communication/rpcEndpoint";
import { NoIovnameHeader } from "../../account/register/components/IovnameForm";
import { REGISTER_IOVNAME_ROUTE } from "../../paths";

export const registerIovnameId = REGISTER_IOVNAME_ROUTE.replace(/\//g, "-");

interface StarnamesNotExistsProps {
  readonly onRegisterIovname: () => void;
  readonly rpcEndpointType: RpcEndpointType;
}

export function GetYourAddressWithExtension({
  onRegisterIovname,
}: Omit<StarnamesNotExistsProps, "rpcEndpointType">): JSX.Element {
  return (
    <Block display="flex" flexDirection="column" alignItems="center">
      <NoIovnameHeader />
      <Block marginTop={3} />
      <Typography variant="subtitle1" weight="semibold" gutterBottom>
        You have no iovnames
      </Typography>
      <Typography variant="body2" color="textPrimary">
        With Neuma you can choose your easy to read human readable address. No more complicated cryptography
        when sending to friends.
      </Typography>
      <Block marginTop={3} />
      <Typography
        id={registerIovnameId}
        variant="subtitle1"
        color="primary"
        weight="semibold"
        inline
        link
        onClick={onRegisterIovname}
      >
        Choose Now
      </Typography>
    </Block>
  );
}

export function GetYourAddressWithLedger(): JSX.Element {
  return (
    <Block display="flex" flexDirection="column" alignItems="center">
      <NoIovnameHeader />
      <Block marginTop={4} />
      <Typography variant="body1" weight="light">
        You can not register
      </Typography>
      <Typography id={registerIovnameId} variant="body1" color="primary" weight="light">
        iovnames
      </Typography>
      <Block textAlign="center">
        <Typography variant="body1" weight="light" inline>
          using{" "}
        </Typography>
        <Typography variant="body1" weight="semibold" inline>
          Ledger Nano S
        </Typography>
      </Block>
    </Block>
  );
}

export function GetYourAddress({ rpcEndpointType, onRegisterIovname }: StarnamesNotExistsProps): JSX.Element {
  switch (rpcEndpointType) {
    case "extension":
      return <GetYourAddressWithExtension onRegisterIovname={onRegisterIovname} />;
    case "ledger":
      return <GetYourAddressWithLedger />;
  }
}

function StarnamesNotExists({ onRegisterIovname, rpcEndpointType }: StarnamesNotExistsProps): JSX.Element {
  const theme = useTheme<Theme>();

  return (
    <Block
      width={450}
      bgcolor={theme.palette.background.paper}
      padding={5}
      display="flex"
      flexDirection="column"
      borderRadius={5}
      textAlign="center"
      border="1px solid #F3F3F3"
    >
      <GetYourAddress onRegisterIovname={onRegisterIovname} rpcEndpointType={rpcEndpointType} />
    </Block>
  );
}

export default StarnamesNotExists;
