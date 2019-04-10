import { Store } from 'redux';
import { RootState, history } from '../../store/reducers';
import { randomString } from '../../utils/test/random';
import { aNewStore } from '../../store';
import TestUtils from 'react-dom/test-utils';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { WELCOME_ROUTE } from '../paths';
import { travelToLogin } from './test/travelToLogin';
import { findRenderedDOMComponentWithId } from '../../utils/test/reactElemFinder';

describe('DOM > Feature > Login', (): void => {
  let store: Store<RootState>;

  beforeEach(
    (): void => {
      store = aNewStore();
    }
  );

  it(`should two inputs, one button and show toast in case if wrong password`, async (): Promise<
    void
  > => {
    const LoginDom = await travelToLogin(store);

    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(
      LoginDom,
      'input'
    );

    expect(inputs.length).toBe(1);

    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(
      LoginDom,
      'button'
    );
    expect(buttons.length).toBe(1);

    //Should show toast message
    const passwordInput = inputs[0];

    TestUtils.act(
      (): void => {
        TestUtils.Simulate.change(passwordInput, {
          target: { value: randomString(10) },
        } as any);
      }
    );

    const form = TestUtils.findRenderedDOMComponentWithTag(LoginDom, 'form');
    TestUtils.act(
      (): void => {
        TestUtils.Simulate.submit(form);
      }
    );

    //Will throw an exception if toast component will not be found
    await findRenderedDOMComponentWithId(LoginDom, 'toast-provider');

    //Bottom links
    const links = TestUtils.scryRenderedDOMComponentsWithTag(LoginDom, 'a');

    expect(links.length).toBe(2);
    expect(links[0].children[0].innerHTML).toBe('Restore account');
    expect(links[1].children[0].innerHTML).toBe('More options');

    TestUtils.act(
      (): void => {
        history.push(WELCOME_ROUTE);
      }
    );
    await whenOnNavigatedToRoute(store, WELCOME_ROUTE);
  }, 55000);
});
