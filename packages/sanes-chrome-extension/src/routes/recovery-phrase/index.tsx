import * as React from 'react';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import ShowRecoveryPhrase from './components/ShowRecoveryPhrase';
import { RECOVERY_PHRASE_ROUTE } from '../paths';
import { history } from '../../store/reducers';
import { PersonaContext } from '../../context/PersonaProvider';

const onBack = (): void => {
  history.goBack();
};

const RecoveryPhrase = (): JSX.Element => {
  const persona = React.useContext(PersonaContext);

  return (
    <PageLayout id={RECOVERY_PHRASE_ROUTE} primaryTitle="Recovery" title="phrase">
      <ShowRecoveryPhrase onBack={onBack} mnemonic={persona.mnemonic} />
    </PageLayout>
  );
};

export default RecoveryPhrase;
