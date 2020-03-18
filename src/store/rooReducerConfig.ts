import { combineReducers } from 'redux';

import { DocReducer as docs } from './docs';
import { UserReducer as user } from './user';

const rootReducer = combineReducers({
  docs,
  user
});

export type AppState = ReturnType<typeof rootReducer>;

export { rootReducer };
