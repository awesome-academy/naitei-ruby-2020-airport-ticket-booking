import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  DropdownMenu,
  Nav,
  NavItem,
  NavLink,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import logo from '../../assets/images/logo.png';
import SignUpModal from '../SignUpModal';
import LogInModal from '../LogInModal';
import './styles.scss';
import { useSelector, useDispatch } from 'react-redux';
import { signOut, staffSignOut } from '../../store/actions';

const Header = () => {
  const { token: userToken, user } = useSelector(state => state.auth);
  const { token: staffToken, user: staff } = useSelector(state => state.staff);

  const { t, i18n } = useTranslation();
  const location = useLocation();

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  const dispatch = useDispatch();

  const guestUserSide = (
    <React.Fragment>
      <NavItem className="nav-item">
        <SignUpModal />
      </NavItem>
      <NavItem className="nav-item">
        <LogInModal />
      </NavItem>
    </React.Fragment>
  );

  const authUserSide = (
    <React.Fragment>
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav>
          {t('header.welcome')} {`${user.full_name}`}
        </DropdownToggle>
        <DropdownMenu right>
          <Link className="profileLink" to="/profile">
            <DropdownItem>{t('header.profile')}</DropdownItem>
          </Link>
          <DropdownItem divider />
          <DropdownItem onClick={() => dispatch(signOut())}>
            {t('header.signOut')}
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </React.Fragment>
  );

  const guestStaffSide = (
    <React.Fragment>
      <NavItem className="nav-item">
        <NavLink className="auth-link" href="/staff/login">
          Log in
        </NavLink>
      </NavItem>
    </React.Fragment>
  );

  const authStaffSide = (
    <React.Fragment>
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav>
          {t('header.welcome')} {`${staff.user_name}`}
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={() => dispatch(staffSignOut())}>
            {t('header.signOut')}
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </React.Fragment>
  );
  return (
    <Fragment>
      <Navbar color="light" expand="sm" light>
        <Link to="/">
          <img src={logo} alt="Logo" width="130" height="60" />
        </Link>
        <Collapse navbar>
          <Nav className="ml-auto" navbar>
            {location.pathname.includes('/staff')
              ? staffToken
                ? authStaffSide
                : guestStaffSide
              : userToken
              ? authUserSide
              : guestUserSide}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {t('header.languages')}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => changeLanguage('en')}>
                  {t('header.eng')}
                </DropdownItem>
                <DropdownItem onClick={() => changeLanguage('vi')}>
                  {t('header.viet')}
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </Fragment>
  );
};

export default Header;
