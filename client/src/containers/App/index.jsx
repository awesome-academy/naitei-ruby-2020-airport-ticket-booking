import React, { useEffect } from 'react';
import './styles.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ToastAlert } from '../../components/Alert';
import BookingSession from '../BookingSession';
import Welcome from '../Welcome';
import Profile from '../../components/Profile';
import StaffPage from '../../components/StaffPage';
import PrivateRoute from '../../components/PrivateRoute';
import { Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, getStaff } from '../../store/actions';

function App() {
  const userToken = useSelector(state => state.auth.token);
  const staffToken = useSelector(state => state.staff.token);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [userToken, dispatch]);

  useEffect(() => {
    dispatch(getStaff());
  }, [staffToken, dispatch]);

  return (
    <div className="App">
      <ToastAlert />
      <Header />
      <Switch>
        <Route path="/booking" component={BookingSession} />
        <PrivateRoute path="/profile" component={Profile} authed={userToken} isUserAuth />
        <PrivateRoute path="/staff" component={StaffPage} authed={staffToken} />
        <Route exact path="/" component={Welcome} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
