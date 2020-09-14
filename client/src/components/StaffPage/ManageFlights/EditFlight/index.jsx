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
import moment from 'moment';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import flightTime from '../../../../constants/flightTime';

const EditFlight = ({ data, submitData, planes }) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(data);

  const toggle = () => {
    if (!modalOpen) {
      setEditData(data);
    }
    setModalOpen(!modalOpen);
  };

  return (
    <Fragment>
      <Button color="info" size="sm" onClick={toggle}>
        <FontAwesomeIcon icon={faEdit} />
      </Button>
      <Modal isOpen={modalOpen} toggle={toggle}>
        <ModalHeader className="modalHeader" toggle={toggle}>
          <FontAwesomeIcon icon={faEdit} className="icon" />
          {t('manageFlights.editFlight')}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={event => {
              event.preventDefault();
              submitData(editData);
              toggle();
            }}
          >
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="departureDate">
                    {t('manageFlights.departureDay')}
                  </Label>
                  <Input
                    type="date"
                    name="departureDate"
                    id="departureDate"
                    value={moment(editData.departure_day).format('YYYY-MM-DD')}
                    onChange={event => {
                      setEditData({
                        ...editData,
                        departure_day: event.target.value,
                      });
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="departureTime">
                    {t('manageFlights.departureTime')}
                  </Label>
                  <Input
                    type="select"
                    name="departureTime"
                    id="departureTime"
                    value={editData.shift_id}
                    onChange={event => {
                      setEditData({
                        ...editData,
                        shift_id: event.target.value,
                      });
                    }}
                  >
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
                  <Label for="planeName">{t('manageFlights.planeName')}</Label>
                  <Input
                    type="select"
                    name="planeName"
                    id="planeName"
                    value={editData.plane_id}
                    onChange={event => {
                      const chosenPlane = planes.find(
                        item => item.id == event.target.value
                      );
                      setEditData({
                        ...editData,
                        plane_id: chosenPlane.id,
                        total_seat:
                          chosenPlane.normal_seat_number +
                          chosenPlane.business_seat_number,
                      });
                    }}
                  >
                    {planes
                      .filter(
                        item =>
                          item.normal_seat_number + item.business_seat_number >=
                          data.reserved_seat
                      )
                      .map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="totalSeat">{t('manageFlights.totalSeats')}</Label>
                  <Input
                    type="number"
                    name="totalSeat"
                    id="totalSeat"
                    disabled
                    value={editData.total_seat}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Button block color="primary" type="submit">
              Submit
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default EditFlight;
