import { Block, CircleImage, Typography } from "medulas-react-components";
import React from "react";

import icon from "../../assets/iov-logo.svg";

export const HEADER_HTML_ID = "header";

const Header = (): JSX.Element => {
  return (
    <Block id={HEADER_HTML_ID} width="100%" minHeight="78px" display="flex" alignItems="center">
      <Block minWidth="205px" display="flex" alignItems="center" justifyContent="center">
        <CircleImage alt="Logo" icon={icon} dia="48px" circleColor="#fff" />
        <Block marginLeft={2}>
          <Typography variant="h5">IOV</Typography>
        </Block>
      </Block>
      <Typography variant="h5">Governance</Typography>
    </Block>
  );
};

export default Header;
