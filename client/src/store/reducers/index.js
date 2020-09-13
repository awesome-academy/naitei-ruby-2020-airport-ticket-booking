import { combineReducers } from 'redux';
import flightReducer from './flightReducer';
import bookingReducer from './bookingReducer';
import authReducer from './authReducer';
import staffReducer from './staffReducer';

const rootReducer = combineReducers({
  flight: flightReducer,
  booking: bookingReducer,
  auth: authReducer,
  staff: staffReducer
});

export default rootReducer;
