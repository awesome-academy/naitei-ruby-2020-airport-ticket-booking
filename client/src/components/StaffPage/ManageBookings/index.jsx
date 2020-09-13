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
  Button
} from 'reactstrap';
import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next';
import { railsApi } from '../../../api/railsApi';
import { reqConfigStaff } from '../../../utils/requestConfig';
import { notifySuccess, notifyError } from '../../../services/alertService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import destination from '../../../constants/destination';
import moment from 'moment';
import bookingStatus from '../../../constants/bookingStatus';
import './styles.scss';

const ManageFlights = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [query, setQuery] = useState({
    status: '',
    departureDate: '',
    planeId: '',
    from: '',
    to: '',
  });

  useEffect(() => {
    fetchData();
  }, [query, currentPage]);

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const { data } = await railsApi.get('/staffs/planes', reqConfigStaff());
        setPlanes(data.data);
      } catch (err) {
        notifyError(err.message);
      }
    };
    fetchPlanes();
  }, []);

  const fetchData = async () => {
    try {
      const config = reqConfigStaff();
      const { data } = await railsApi.get('/staffs/bookings', {
        ...config,
        params: {
          page: currentPage + 1,
          booking_status: query.status,
          departure_day: query.departureDate,
          plane_id: query.planeId,
          departure: query.from,
          arrive: query.to,
        },
      });
      if (data.data.meta_data) {
        setTotalPage(data.data.meta_data.total_pages);
      }
      setBookings(data.data.details);
    } catch (err) {
      notifyError(err.message);
    }
  };

  const changeBookingStatus = async booking => {
    try {
      const { data } = await railsApi.put(
        `/staffs/bookings/${booking.id}`,
        {
          booking_status_id: booking.booking_status === 'Pending' ? 2 : 1,
        },
        reqConfigStaff()
      );
      if (data.success) {
        await fetchData();
        notifySuccess('Update successful!!');
      } else {
        notifyError('Something went wrong ..');
      }
    } catch (err) {
      notifyError('Something went wrong ..');
    }
  };

  const paginationElement = (
    <ReactPaginate
      pageCount={totalPage}
      pageRangeDisplayed={4}
      marginPagesDisplayed={3}
      previousLabel={t('manageFlights.previous')}
      nextLabel={t('manageFlights.next')}
      containerClassName="pagination"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      activeClassName="active"
      previousClassName="page-item prev"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link next"
      disabledClassName="disabled"
      breakClassName="page-item disabled"
      breakLinkClassName="page-link"
      forcePage={currentPage}
      onPageChange={data => setCurrentPage(data.selected)}
    />
  );

  return (
    <Fragment>
      <Row>
        <Col xs="12">
          <h3>{t('manageBookings.title')}</h3>
          <hr />
        </Col>
      </Row>
      <Form
        onSubmit={event => {
          event.preventDefault();
        }}
      >
        <Row className="filterRow">
          <Col xs="12">
            <Row>
              <Col xs="3">
                <FormGroup row>
                  <Label for="status">{t('manageFlights.status')}:</Label>
                  <Col sm="8">
                    <Input
                      value={query.status}
                      onChange={event =>
                        setQuery({
                          ...query,
                          status: event.target.value,
                        })
                      }
                      type="select"
                      name="status"
                      id="status"
                    >
                      <option value="">{t('bookingHistory.all')}</option>
                      {bookingStatus.map(item => (
                        <option key={item.id} value={item.status}>
                          {item.status}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup>
              </Col>
              <Col xs="5">
                <FormGroup
                  row
                  style={{
                    paddingLeft: '2em',
                  }}
                >
                  <Label for="departureDate">
                    {t('manageFlights.departureDay')}:
                  </Label>
                  <Col sm="7">
                    <Input
                      value={query.departureDate}
                      onChange={event =>
                        setQuery({
                          ...query,
                          departureDate: event.target.value,
                        })
                      }
                      type="date"
                      name="departureDate"
                      id="departureDate"
                    />
                  </Col>
                </FormGroup>
              </Col>
              <Col xs="4">
                <FormGroup row>
                  <Label for="planeName">{t('manageFlights.planeName')}:</Label>
                  <Col sm="8">
                    <Input
                      type="select"
                      name="planeName"
                      id="planeName"
                      value={query.planeId}
                      onChange={event =>
                        setQuery({
                          ...query,
                          planeId: event.target.value,
                        })
                      }
                    >
                      <option value="">{t('bookingHistory.all')}</option>
                      {planes.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="filterRow">
          <Col xs="12">
            <Row>
              <Col xs="4">
                <FormGroup row>
                  <Label for="from">{t('manageFlights.from')}:</Label>
                  <Col sm="8">
                    <Input
                      value={query.from}
                      onChange={event =>
                        setQuery({
                          ...query,
                          from: event.target.value,
                        })
                      }
                      type="select"
                      name="from"
                      id="from"
                    >
                      <option value="">{t('bookingHistory.all')}</option>
                      {destination.map(item => (
                        <option key={item.id} value={item.subname}>
                          {item.fullname}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup>
              </Col>
              <Col xs="4">
                <FormGroup row>
                  <Label for="to">{t('manageFlights.to')}:</Label>
                  <Col sm="8">
                    <Input
                      value={query.to}
                      onChange={event =>
                        setQuery({
                          ...query,
                          to: event.target.value,
                        })
                      }
                      type="select"
                      name="to"
                      id="to"
                    >
                      <option value="">{t('bookingHistory.all')}</option>
                      {destination.map(item => (
                        <option key={item.id} value={item.subname}>
                          {item.fullname}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      {paginationElement}
      <Table striped bordered>
        <thead>
          <tr>
            <th>{t('bookingHistory.fullName')}</th>
            <th>{t('bookingHistory.dateOfBirth')}</th>
            <th>{t('bookingHistory.nation')}</th>
            <th>{t('bookingHistory.plane')}</th>
            <th>{t('bookingHistory.departureDay')}</th>
            <th>{t('manageFlights.departureTime')}</th>
            <th>{t('bookingHistory.fromTo')}</th>
            <th>{t('bookingHistory.ticketPrice')}</th>
            <th>{t('bookingHistory.seatNumber')}</th>
            <th>{t('bookingHistory.seatType')}</th>
            <th>{t('bookingHistory.status')}</th>
            <th></th>
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
              <td>{item.shift_id * 7}:00</td>
              <td>
                {item.departure_location} - {item.arrive_location}
              </td>
              <td>{item.total_price} $</td>
              <td>{item.seat_number}</td>
              <td>{item.seat_type}</td>
              <td>
                <Badge
                  color={
                    item.booking_status === 'Pending'
                      ? 'warning'
                      : item.booking_status === 'Cancelled'
                      ? 'danger'
                      : 'success'
                  }
                  pill
                >
                  {item.booking_status}
                </Badge>
              </td>
              <td>
                {item.bookingStatus === 'Cancelled' ? null : (
                  <Button
                    color="info"
                    size="sm"
                    onClick={() => changeBookingStatus(item)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {paginationElement}
    </Fragment>
  );
};

export default ManageFlights;
