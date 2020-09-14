import React, { useState } from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import ManageFlights from './ManageFlights';
import ManageBookings from './ManageBookings';
import './styles.scss';

const Profile = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  return (
    <Row className="staffPage">
      <Col xs="2">
        <ListGroup>
          <ListGroupItem active={tab === 0} action onClick={() => setTab(0)}>
            {t('staffPage.manageFlights')}
          </ListGroupItem>
          <ListGroupItem active={tab === 1} action onClick={() => setTab(1)}>
            {t('staffPage.manageBookings')}
          </ListGroupItem>
        </ListGroup>
      </Col>
      <Col xs="10">
        {tab === 0 ? <ManageFlights /> : <ManageBookings />}
      </Col>
    </Row>
  );
};

export default Profile;
