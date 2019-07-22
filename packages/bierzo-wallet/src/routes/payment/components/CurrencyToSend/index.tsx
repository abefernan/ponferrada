import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import { FormApi } from 'final-form';
import Block from 'medulas-react-components/lib/components/Block';
import SelectFieldForm, { Item } from 'medulas-react-components/lib/components/forms/SelectFieldForm';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import Typography from 'medulas-react-components/lib/components/Typography';
import {
  composeValidators,
  greaterOrEqualThan,
  lowerOrEqualThan,
  number,
  required,
} from 'medulas-react-components/lib/utils/forms/validators';
import React, { useMemo, useState } from 'react';
import * as ReactRedux from 'react-redux';

import { RootState } from '../../../../store/reducers';
import { amountToNumber, amountToString } from '../../../../utils/balances';

const useStyles = makeStyles(() => ({
  avatar: {
    backgroundColor: '#ffe152',
    fontSize: '27.5px',
    width: '72px',
    height: '72px',
    margin: '-76px 0 40px 0',
  },
}));

export const QUANTITY_FIELD = 'quantityField';
const QUANTITY_MIN = 1e-9;
export const CURRENCY_FIELD = 'currencyField';

interface Props {
  readonly form: FormApi;
}

const CurrencyToSend = ({ form }: Props): JSX.Element => {
  const tokens = ReactRedux.useSelector((state: RootState) => state.balances);
  const classes = useStyles();

  const currencyItems = Object.keys(tokens).map(token => ({
    name: token,
  }));

  const [balance, setBalance] = useState(tokens[currencyItems[0].name]);

  const validator = useMemo(() => {
    return composeValidators(
      required,
      number,
      lowerOrEqualThan(amountToNumber(balance)),
      greaterOrEqualThan(QUANTITY_MIN),
    );
  }, [balance]);

  const avatarClasses = {
    root: classes.avatar,
  };

  const handleChange = (item: Item): void => {
    setBalance(tokens[item.name]);
  };

  return (
    <Paper>
      <Block display="flex" flexDirection="column" alignItems="center" width="100%" marginTop={4} padding={5}>
        <Avatar classes={avatarClasses}>
          <FontAwesomeIcon icon={faUser} color="#ffffff" />
        </Avatar>
        <Typography color="textPrimary" variant="subtitle2">
          You send
        </Typography>
        <Block width="100%" marginTop={5} marginBottom={1}>
          <Block display="flex">
            <Block width="100%" marginRight={1}>
              <TextFieldForm
                name={QUANTITY_FIELD}
                form={form}
                validate={validator}
                placeholder="0,00"
                fullWidth
                margin="none"
              />
            </Block>
            <Block height="32px">
              <SelectFieldForm
                fieldName={CURRENCY_FIELD}
                form={form}
                maxWidth="60px"
                items={currencyItems}
                initial={balance.tokenTicker}
                onChangeCallback={handleChange}
              />
            </Block>
          </Block>
        </Block>
        <Block marginTop={1}>
          <Typography color="textSecondary" variant="subtitle2">
            balance: {amountToString(balance)}
          </Typography>
        </Block>
      </Block>
    </Paper>
  );
};

export default CurrencyToSend;
