import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPaginate from 'react-paginate';
import { railsApi } from '../../../api/railsApi';
import { notifyError, notifySuccess } from '../../../services/alertService';
import { faPlaneSlash } from '@fortawesome/free-solid-svg-icons';
import {
  Row,
  Col,
  Table,
  Button,
  Badge,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { reqConfigStaff } from '../../../utils/requestConfig';
import routes from '../../../constants/routes';
import flightStatus from '../../../constants/flightStatus.json';
import moment from 'moment';
import EditFlight from './EditFlight';
import destination from '../../../constants/destination';
import './styles.scss';
import AddFlight from './AddFlight';

const ManageFlights = () => {
  const { t } = useTranslation();
  const { is_admin } = useSelector(state => state.staff.user);
  const [flights, setFlights] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [modal, setModal] = useState(-1);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [query, setQuery] = useState({
    statusId: '',
    departureDate: '',
    planeId: '',
    from: '',
    to: '',
  });

  useEffect(() => {
    fetchData();
  }, [query, currentPage, totalPage]);

  useEffect(() => {
    fetchPlanes();
  }, []);

  const fetchData = async () => {
    try {
      const config = reqConfigStaff();
      const { data: allData } = await railsApi.get('/staffs/flights', {
        ...config,
        params: {
          page: currentPage + 1,
          flight_status_id: query.statusId,
          departure_day: query.departureDate,
          plane_id: query.planeId,
          from: query.from,
          to: query.to,
        },
      });
      if (allData.data.meta_data) {
        setTotalPage(allData.data.meta_data.total_pages);
      }
      const flightPromises = allData.data.details.map(async item => {
        const { data: planeData } = await railsApi.get(
          `/staffs/planes/${item.plane_id}`,
          reqConfigStaff()
        );
        return {
          ...item,
          plane_name: planeData.data.name,
          from: routes[item.flight_route_id - 1].from,
          to: routes[item.flight_route_id - 1].to,
          status: flightStatus[item.flight_status_id - 1].status,
          departure_time: item.shift_id * 7,
          total_seat:
            planeData.data.normal_seat_number +
            planeData.data.business_seat_number,
          reserved_seat:
            item.normal_reserved_seat + item.business_reserved_seat,
        };
      });
      const flightData = await Promise.all(flightPromises);
      setFlights(flightData);
    } catch (err) {
      notifyError(err.message);
    }
  };

  const fetchPlanes = async () => {
    try {
      const { data } = await railsApi.get('/staffs/planes', reqConfigStaff());
      setPlanes(data.data);
    } catch (err) {
      notifyError(err.message);
    }
  };

  const cancelFlight = async flight => {
    try {
      const { data } = await railsApi.delete(
        `/staffs/flights/${flight.id}`,
        reqConfigStaff()
      );
      if (data.success) {
        setModal(-1);
        await fetchData();
        notifySuccess('Update successful!!');
      } else {
        notifyError('Something went wrong ..');
      }
    } catch (err) {
      notifyError('Something went wrong ..');
    }
  };

  const updateFlight = async flight => {
    try {
      const { data } = await railsApi.put(
        `/staffs/flights/${flight.id}`,
        {
          plane_id: flight.plane_id,
          shift_id: flight.shift_id,
          departure_day: flight.departure_day,
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

  const createFlight = async flight => {
    try {
      const { data } = await railsApi.post(
        `/staffs/flights/`,
        {
          plane_id: flight.planeId,
          shift_id: flight.shiftId,
          departure_day: flight.departureDate,
          flight_route_id: routes.find(
            ({ from, to }) => flight.from === from && flight.to === to
          ).id,
        },
        reqConfigStaff()
      );
      if (data.success) {
        await fetchData();
        notifySuccess('Create successful!!');
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
          <h3>{t('manageFlights.title')}</h3>
          <hr />
        </Col>
      </Row>
      <Row className="filterRow">
        <Col xs="12">
          <Row>
            <Col xs="3">
              <FormGroup row>
                <Label for="status">{t('manageFlights.status')}:</Label>
                <Col sm="8">
                  <Input
                    value={query.statusId}
                    onChange={event =>
                      setQuery({
                        ...query,
                        statusId: event.target.value,
                      })
                    }
                    type="select"
                    name="status"
                    id="status"
                  >
                    <option value="">{t('bookingHistory.all')}</option>
                    {flightStatus.map(item => (
                      <option key={item.id} value={item.id}>
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {paginationElement}
        {is_admin ? (
          <AddFlight planes={planes} submitData={createFlight} />
        ) : null}
      </div>
      <Table striped bordered>
        <thead>
          <tr>
            <th>{t('manageFlights.departureDay')}</th>
            <th>{t('manageFlights.planeName')}</th>
            <th>{t('manageFlights.totalSeats')}</th>
            <th>{t('manageFlights.reservedSeats')}</th>
            <th>{t('manageFlights.fromTo')}</th>
            <th>{t('manageFlights.departureTime')}</th>
            <th>{t('manageFlights.status')}</th>
            {is_admin ? <th></th> : null}
          </tr>
        </thead>
        <tbody>
          {flights.map((item, index) => (
            <tr key={index}>
              <td>{moment(item.departure_day).format('DD-MM-YYYY')}</td>
              <td>{item.plane_name}</td>
              <td>{item.total_seat}</td>
              <td>{item.reserved_seat}</td>
              <td>
                {item.from} - {item.to}
              </td>
              <td>{item.departure_time}:00</td>
              <td>
                <Badge
                  color={
                    item.status === 'Undepart'
                      ? 'secondary'
                      : item.status === 'Flying'
                      ? 'warning'
                      : item.status === 'Cancelled'
                      ? 'danger'
                      : 'success'
                  }
                  pill
                >
                  {item.status}
                </Badge>
              </td>
              {is_admin ? (
                <td>
                  {item.status === 'Cancelled' ||
                  item.status === 'Arrived' ||
                  item.status === 'Flying' ? null : (
                    <div className="actions">
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => setModal(index)}
                      >
                        <FontAwesomeIcon icon={faPlaneSlash} />
                      </Button>
                      <EditFlight
                        planes={planes}
                        data={item}
                        submitData={updateFlight}
                      />
                    </div>
                  )}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
        {is_admin ? (
          <Modal isOpen={modal !== -1} toggle={() => setModal(-1)}>
            <ModalBody>{t('manageFlights.areYouSure')}</ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => cancelFlight(flights[modal])}
              >
                {t('manageFlights.cancelFlight')}
              </Button>{' '}
              <Button color="secondary" onClick={() => setModal(-1)}>
                {t('manageFlights.cancel')}
              </Button>
            </ModalFooter>
          </Modal>
        ) : null}
      </Table>
      {paginationElement}
    </Fragment>
  );
};

export default ManageFlights;
