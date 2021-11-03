import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { stripTimeFromDate } from '../helpers/util';

// DATE
const SET_DATE = 'SET_DATE';

export const setDate = (date) => {
  return { type: SET_DATE, date };
};

// DATE reducer
const initialValue = new Date();
const dateReducer = (state = initialValue, action) => {
  switch (action.type) {
    case SET_DATE:
      return action.date;
    default:
      return state;
  }
};

// ADJUSTED_DATE
const SET_ADJUSTED_DATE = 'SET_ADJUSTED_DATE';

export const setAdjustedDate = (date) => {
  return { type: SET_ADJUSTED_DATE, date };
};

// ADJUSTED_DATE reducer
const initState = stripTimeFromDate(new Date());
const adjustedDateReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_ADJUSTED_DATE:
      return action.date;
    default:
      return state;
  }
};

// MARKER
const SET_MARKER = 'SET_MARKER';

export const setMarker = (markerId) => {
  return { type: SET_MARKER, markerId };
};
// MARKER reducer
const markerReducer = (state = null, action) => {
  switch (action.type) {
    case SET_MARKER:
      return action.markerId;
    default:
      return state;
  }
};

const reducer = combineReducers({
  date: dateReducer,
  adjustedDate: adjustedDateReducer,
  marker: markerReducer,
});

// disable the logging for now
const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));

// const middleware = composeWithDevTools(
//   applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
// );
const store = createStore(reducer, middleware);

export default store;
// export * from './auth';
