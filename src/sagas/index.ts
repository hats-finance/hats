import { all } from 'redux-saga/effects'; // , put, takeLatest
//import * as types from '../constants/action-types';

function* actionWatcher() {

}

export default function* rootSaga() {
  yield all([
    actionWatcher()
  ]);
}
