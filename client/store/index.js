import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { format } from 'date-fns';
import auth from './auth';

// DATE
const SET_DATE = 'SET_DATE';

export const setDate = (date) => {
  return { type: SET_DATE, date };
};

// DATE reducer
const today = format(new Date(), 'MM/dd/yyyy');
const dateReducer = (state = today, action) => {
  switch (action.type) {
    case SET_DATE:
      return action.date;
    default:
      return state;
  }
};

// TIME
const SET_TIME = 'SET_TIME';

export const setTime = (ms, formatted) => {
  // console.log('setTime');
  return { type: SET_TIME, ms, formatted };
};

// TIME reducer
const timeReducer = (state = { ms: 0, formatted: null }, action) => {
  switch (action.type) {
    case SET_TIME:
      return { ms: action.ms, formatted: action.formatted };
    default:
      return state;
  }
};

// MARKER
const SET_MARKER = 'SET_MARKER';

export const setMarker = (marker) => {
  return { type: SET_MARKER, marker };
};
// MARKER reducer
const markerReducer = (state = { selectedMarker: null }, action) => {
  switch (action.type) {
    case SET_MARKER:
      return action.marker;
    default:
      return state;
  }
};

const reducer = combineReducers({
  auth,
  date: dateReducer,
  time: timeReducer,
  marker: markerReducer,
});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from './auth';
