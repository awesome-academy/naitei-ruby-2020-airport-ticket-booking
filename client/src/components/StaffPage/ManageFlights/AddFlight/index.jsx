import React, { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Row,
  Col,
  Label,
  FormGroup,
  Input,
  Button,
} from 'reactstrap';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import flightTime from '../../../../constants/flightTime';
import destination from '../../../../constants/destination';
import formatDate from '../../../../utils/formatDate';

const initialData = {
  departureDate: '',
  shiftId: 0,
  planeId: 0,
  totalSeat: 0,
  from: '',
  to: '',
};

const AddFlight = ({ submitData, planes }) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState(initialData);

  const toggle = () => {
    if (!modalOpen) {
      setData(initialData);
    }
    setModalOpen(!modalOpen);
  };

  return (
    <Fragment>
      <Button style={{ marginBottom: '1em' }} color="primary" onClick={toggle}>
        {t('manageFlights.addFlight')}
      </Button>
      <Modal isOpen={modalOpen} toggle={toggle}>
        <ModalHeader className="modalHeader" toggle={toggle}>
          <FontAwesomeIcon icon={faPlusSquare} className="icon" />
          {t('manageFlights.addFlight')}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={event => {
              event.preventDefault();
              submitData(data);
              toggle();
            }}
          >
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label className="form-label required" for="departureDate">
                    {t('manageFlights.departureDay')}
                  </Label>
                  <Input
                    type="date"
                    name="departureDate"
                    id="departureDate"
                    value={data.departureDate}
                    min={formatDate(new Date())}
                    onChange={event => {
                      setData({
                        ...data,
                        departureDate: event.target.value,
                      });
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="form-label required" for="departureTime">
                    {t('manageFlights.departureTime')}
                  </Label>
                  <Input
                    type="select"
                    name="departureTime"
                    id="departureTime"
                    value={data.shiftId}
                    onChange={event => {
                      setData({
                        ...data,
                        shiftId: event.target.value,
                      });
                    }}
                  >
                    <option value="" hidden>
                      {t('manageFlights.chooseTime')}
                    </option>
                    {flightTime.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.time}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label className="form-label required" for="planeName">
                    {t('manageFlights.planeName')}
                  </Label>
                  <Input
                    type="select"
                    name="planeName"
                    id="planeName"
                    value={data.planeId}
                    onChange={event => {
                      const chosenPlane = planes.find(
                        item => item.id == event.target.value
                      );
                      setData({
                        ...data,
                        planeId: chosenPlane.id,
                        totalSeat:
                          chosenPlane.normal_seat_number +
                          chosenPlane.business_seat_number,
                      });
                    }}
                  >
                    <option value="" hidden>
                      {t('manageFlights.choosePlane')}
                    </option>
                    {planes.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="form-label required" for="totalSeat">
                    {t('manageFlights.totalSeats')}
                  </Label>
                  <Input
                    type="number"
                    name="totalSeat"
                    id="totalSeat"
                    disabled
                    value={data.totalSeat}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label className="form-label required" for="from">
                    {t('manageFlights.from')}
                  </Label>
                  <Input
                    type="select"
                    name="from"
                    id="from"
                    value={data.from}
                    onChange={event => {
                      setData({
                        ...data,
                        from: event.target.value,
                      });
                    }}
                  >
                    <option value="" hidden>
                      {t('manageFlights.chooseDestination')}
                    </option>
                    {destination.map(item => (
                      <option key={item.id} value={item.fullname}>
                        {item.fullname}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="form-label required" for="from">
                    {t('manageFlights.to')}
                  </Label>
                  <Input
                    type="select"
                    name="to"
                    id="to"
                    value={data.to}
                    onChange={event => {
                      setData({
                        ...data,
                        to: event.target.value,
                      });
                    }}
                  >
                    <option value="" hidden>
                      {t('manageFlights.chooseDestination')}
                    </option>
                    {destination.map(item => (
                      <option key={item.id} value={item.fullname}>
                        {item.fullname}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Button
              block
              color="primary"
              type="submit"
              disabled={
                data.departureDate === '' ||
                data.shiftId === 0 ||
                data.planeId === 0 ||
                data.from === '' ||
                data.to === '' ||
                data.from === data.to
              }
            >
              Submit
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default AddFlight;
