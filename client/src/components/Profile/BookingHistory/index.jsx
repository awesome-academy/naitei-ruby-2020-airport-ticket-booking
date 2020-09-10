import React, { useState, useEffect, Fragment } from 'react';
import {
  Table,
  Badge,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { railsApi } from '../../../api/railsApi';
import { reqConfig } from '../../../utils/requestConfig';
import { notifyError } from '../../../services/alertService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import destination from '../../../constants/destination';
import moment from 'moment';
import './styles.scss';

const BookingHistory = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [statusQuery, setStatusQuery] = useState('');
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [doSubmit, setDoSubmit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = reqConfig();
        const { data } = await railsApi.get('/customers/bookings/search', {
          ...config,
          params: {
            booking_status: statusQuery,
            departure: fromQuery,
            arrive: toQuery,
          },
        });
        setBookings(data.data.details);
      } catch (err) {
        notifyError(err.message);
      }
    };
    fetchData();
  }, [doSubmit, statusQuery, fromQuery, toQuery]);

  return (
    <Fragment>
      <Row>
        <Col xs="12">
          <h3>{t('bookingHistory.title')}</h3>
          <hr />
        </Col>
      </Row>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setDoSubmit(!doSubmit);
        }}
      >
        <Row id="formRow">
          <Col xs="11" id="formCol">
            <Row>
              <Col xs="4">
                <FormGroup row>
                  <Label for="status">{t('bookingHistory.status')}:</Label>
                  <Col sm="10">
                    <Input
                      value={statusQuery}
                      onChange={event => setStatusQuery(event.target.value)}
                      type="select"
                      name="status"
                      id="status"
                    >
                      <option value="">All</option>
                      <option value="Pending">Pending</option>
                      <option value="Success">Success</option>
                    </Input>
                  </Col>
                </FormGroup>
              </Col>
              <Col xs="4">
                <FormGroup row>
                  <Label for="from">{t('bookingHistory.from')}:</Label>
                  <Col sm="10">
                    <Input
                      type="select"
                      value={fromQuery}
                      onChange={event => setFromQuery(event.target.value)}
                      name="from"
                      id="from"
                    >
                      <option value="">{t('bookingHistory.all')}</option>
                      {destination.map(item => (
                        <option value={item.subname}>{item.fullname}</option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup>
              </Col>
              <Col xs="4">
                <FormGroup row>
                  <Label for="to">{t('bookingHistory.to')}:</Label>
                  <Col sm="10">
                    <Input
                      type="select"
                      value={toQuery}
                      onChange={event => setToQuery(event.target.value)}
                      name="to"
                      id="to"
                    >
                      <option value="">{t('bookingHistory.all')}</option>
                      {destination.map(item => (
                        <option value={item.subname}>{item.fullname}</option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          </Col>
          <Col id="filter" xs="1">
            <Button color="secondary">
              <FontAwesomeIcon icon={faFilter} />
            </Button>
          </Col>
        </Row>
      </Form>
      <Table striped bordered>
        <thead>
          <tr>
            <th>{t('bookingHistory.fullName')}</th>
            <th>{t('bookingHistory.dateOfBirth')}</th>
            <th>{t('bookingHistory.nation')}</th>
            <th>{t('bookingHistory.plane')}</th>
            <th>{t('bookingHistory.departureDay')}</th>
            <th>{t('bookingHistory.fromTo')}</th>
            <th>{t('bookingHistory.ticketPrice')}</th>
            <th>{t('bookingHistory.seatNumber')}</th>
            <th>{t('bookingHistory.seatType')}</th>
            <th>{t('bookingHistory.status')}</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((item, index) => (
            <tr key={index}>
              <td>{item.booking_name}</td>
              <td>{moment(item.booking_dob).format('DD-MM-YYYY')}</td>
              <td>{item.booking_nation}</td>
              <td>{item.plane_name}</td>
              <td>{moment(item.departure_day).format('DD-MM-YYYY')}</td>
              <td>
                {item.departure_location} - {item.arrive_location}
              </td>
              <td>{item.total_price} $</td>
              <td>{item.seat_number}</td>
              <td>{item.seat_type}</td>
              <td>
                <Badge
                  color={
                    item.booking_status === 'Pending' ? 'warning' : 'success'
                  }
                  pill
                >
                  {item.booking_status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  );
};

export default BookingHistory;
