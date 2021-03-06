import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  FormFeedback,
  Form,
  Label,
  Input,
  NavLink,
} from 'reactstrap';
import { Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { logIn } from '../../store/actions';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import './style.scss';

const initialStates = {
  email: '',
  password: '',
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .label('Email')
    .trim()
    .min(5, 'At least 5 characters required')
    .max(255, 'At most 255 characters required')
    .email('Please enter a valid email')
    .required('Please enter a registered email'),
  password: yup
    .string()
    .label('Password')
    .trim()
    .min(6, 'At least 6 characters required')
    .max(15, 'At most 15 characters required')
    .required('Please enter a valid password'),
});

function LogInModal() {
  const [modalOpen, setModal] = useState(false);
  const dispatch = useDispatch();
  const { token, error } = useSelector(state => state.auth);
  const { t } = useTranslation();
  const formikRef = useRef();

  const toggle = useCallback(() => {
    if (modalOpen) {
      formikRef.current.resetForm({
        values: initialStates,
        touched: null,
        errors: null,
      });
    }
    setModal(!modalOpen);
  }, [modalOpen]);

  useEffect(() => {
    if (token) {
      toggle();
    }
    if (error === 400 || error === 404) {
      formikRef.current.setFieldValue('password', '');
    }
  }, [token, error, toggle]);

  return (
    <Fragment>
      <Formik
        initialValues={initialStates}
        validationSchema={validationSchema}
        innerRef={formikRef}
        onSubmit={(values, actions) => {
          dispatch(logIn(values));
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          isValid,
          errors,
          touched,
        }) => (
          <Fragment>
            <NavLink className="auth-link" onClick={toggle}>
              {t('logIn.title')}
            </NavLink>
            <Modal isOpen={modalOpen} toggle={toggle}>
              <ModalHeader className="modalHeader" toggle={toggle}>
                <FontAwesomeIcon icon={faSignInAlt} className="icon" />
                {t('logIn.title')}
              </ModalHeader>
              <ModalBody>
                <Form className="modalForm" onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="email"> {t('logIn.email')}</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={
                        touched.email && errors.email !== undefined
                      }
                      placeholder={t('logIn.emailPlaceholder')}
                    />
                    {touched.email && errors.email && (
                      <FormFeedback>{errors.email}</FormFeedback>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">{t('logIn.password')}</Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={
                        touched.password && errors.password !== undefined
                      }
                      placeholder={t('logIn.passwordPlaceholder')}
                    />
                    {touched.password && errors.password && (
                      <FormFeedback>{errors.password}</FormFeedback>
                    )}
                  </FormGroup>
                  <Button
                    block
                    color="primary"
                    type="submit"
                    disabled={!isValid || !values.email}
                  >
                    {t('logIn.title')}
                  </Button>
                </Form>
              </ModalBody>
            </Modal>
          </Fragment>
        )}
      </Formik>
    </Fragment>
  );
}

export default LogInModal;
