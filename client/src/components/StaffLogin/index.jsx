import React, { useEffect, useRef } from 'react';
import { Form, FormGroup, FormFeedback, Label, Input, Button } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { staffLogIn } from '../../store/actions';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import './styles.scss';

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

const StaffLogin = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { token, error } = useSelector(state => state.staff);
  const formikRef = useRef();

  useEffect(() => {
    if (error === 400 || error === 404) {
      formikRef.current.setFieldValue('password', '');
    }
  }, [token, error]);

  return (
    <div className="staffLogin">
      <h2 className="mb-3">Staff Login</h2>
      <Formik
        initialValues={initialStates}
        validationSchema={validationSchema}
        innerRef={formikRef}
        onSubmit={(values, actions) => {
          dispatch(staffLogIn(values));
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
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="email">{t('logIn.email')}</Label>
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
              <Label for="examplePassword">{t('logIn.password')}</Label>
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
              {t('staffLogIn.logIn')}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StaffLogin;
