import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { createStore, StoreProvider } from 'easy-peasy';
import model from '../../state/model';
import SignInSide from './login';

describe('Login Page', () => {
  let shallow;
  let wrapper;

  beforeAll(() => {
    shallow = createShallow({ dive: true, untilSelector: 'button' });
  });

  beforeEach(() => {
    const store = createStore(model);
    const app = (
      <StoreProvider store={store}>
        <SignInSide.WrappedComponent />
      </StoreProvider>
    );
    wrapper = shallow(app);
  });

  it('should render page', () => {
    expect(wrapper.length).toBe(1);
  });

  it('should render user textfield', () => {
    console.log('Hello');
    // console.log(wrapper.find('TextField').debug());
    // expect(userField.length).toBe(2);
  });
});

// /**
//  * Factory function to create a ShallowWrapper for the App component.
//  * @function setup
//  * @param {object} props - Component props specific to this setup.
//  * @param {object} state - Initial state for setup.
//  * @returns {ShallowWrapper}
// */
// const container = shallow(<SignInSide></SignInSide>)

// /**
//  * Return ShallowWrapper containing node(s) with the given data-test value.
//  * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper to search within.
//  * @param {string} val - Value of data-test attribute for search.
//  * @returns {ShallowWrapper}
//  */
// const findByTestAttr = (wrapper, val) => {
//   return wrapper.find(`[data-test="${val}"]`);
// }

// test('page renders without error', () => {
//   const item = container.find(`[data-test="login-page"]`);
//   console.log(container);
//   expect(item.length).toEqual(1);
// });
