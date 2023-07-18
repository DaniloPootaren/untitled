import React, {Fragment, useState} from 'react';
import {COLLECTION_TYPE, CONTENT_MANAGER} from '../../utils/url';
import {Button} from '@strapi/design-system';
import {useLocation} from 'react-router-dom';
import {CHECKLIST_RESULT_SLUG} from '../../constants/slugs';
import ChecklistModal from './ChecklistModal';
import {DownloadIcon} from '../Icons/Download';

const validPrefixName = `/${CONTENT_MANAGER}/${COLLECTION_TYPE}/`;
const validPathNames = [`${validPrefixName}${CHECKLIST_RESULT_SLUG}`];

const ChecklistReport = () => {
  const location = useLocation();
  const displayButton = validPathNames.includes(location.pathname);

  const [showModal, setShowModal] = useState<boolean>();

  if (!displayButton) {
    return <></>;
  }

  const reportHandler = () => {
    setShowModal(true);
  };

  const onClose = () => {
    setShowModal(false);
  };

  return (
    <Fragment>
      {showModal && <ChecklistModal onClose={onClose} />}
      <Button
        variant="success"
        startIcon={<DownloadIcon />}
        onClick={reportHandler}>
        Generate Report
      </Button>
    </Fragment>
  );
};

export default ChecklistReport;
