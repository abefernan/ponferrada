import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { Action } from 'redux';

export interface ExtensionState {
  readonly connected: boolean;
  readonly installed: boolean;
}

export interface SetExtensionStateActionType extends Action {
  type: '@@extension/SET_EXTENSION_STATE';
  payload: ExtensionState;
}

export type ExtensionActions = ActionType<typeof actions>;

const initState: ExtensionState = {
  connected: true,
  installed: true,
};

export function extensionReducer(
  state: ExtensionState = initState,
  action: ExtensionActions,
): ExtensionState {
  switch (action.type) {
    case '@@extension/SET_EXTENSION_STATE':
      return action.payload;
    default:
      return state;
  }
}