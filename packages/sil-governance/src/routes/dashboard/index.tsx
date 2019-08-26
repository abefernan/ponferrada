import { Block, Hairline } from "medulas-react-components";
import React from "react";

import AsideFilter from "../../components/AsideFilter";
import Header from "../../components/Header";
import ProposalsList from "./components/ProposalsList";

const Dashboard = (): JSX.Element => {
  return (
    <Block width="100%" maxWidth="1024px" height="auto" display="flex" flexDirection="column" margin="0 auto">
      <Header />
      <Hairline />
      <Block minWidth="100%" display="flex">
        <AsideFilter />
        <ProposalsList />
      </Block>
    </Block>
  );
};

export default Dashboard;