import React, {Fragment, memo, useState} from 'react';
import {Button} from '@strapi/design-system';
import TrainingReportModal from './TrainingReportModal';
import {DownloadIcon} from '../Icons/Download';
import {TRAINING_SLUG, VALID_PREFIX_NAME} from '../../constants/slugs';
import {useLocation} from 'react-router-dom';

const validPathNames = [`${VALID_PREFIX_NAME}${TRAINING_SLUG}`];

const ExportCSV = () => {
  const [showModal, setShowModal] = useState<boolean>();
  const location = useLocation();
  const displayButton = validPathNames.includes(location.pathname);
  const reportHandler = () => {
    setShowModal(true);
  };

  const onClose = () => {
    setShowModal(false);
  };

  if (!displayButton) {
    return <></>;
  }

  return (
    <Fragment>
      {showModal && <TrainingReportModal onClose={onClose} />}
      <Button
        variant="success"
        startIcon={<DownloadIcon />}
        onClick={reportHandler}>
        Generate Report
      </Button>
    </Fragment>
  );
};

export default memo(ExportCSV);
