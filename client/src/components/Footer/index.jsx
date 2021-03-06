import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import './styles.scss';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <footer className='footer'>
        <small>{t('footer.ror')}</small>
        <nav>
          <ul>
            <li>{t('footer.contact')}</li>
            <li>{t('footer.news')}</li>
          </ul>
        </nav>
      </footer>
    </Fragment>
  );
};

export default Footer;
