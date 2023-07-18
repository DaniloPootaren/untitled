import React, {Fragment, memo} from 'react';
import {FileFormat} from '../../../model';
import {Button} from '@strapi/design-system';
import {DownloadIcon} from '../../Icons/Download';

const Component = ({
  loading,
  onDownload,
}: {
  loading: FileFormat;
  onDownload: (fileFormat: FileFormat) => void;
}) => {
  return (
    <Fragment>
      <Button
        variant="success"
        startIcon={<DownloadIcon />}
        loading={loading === FileFormat.XLSX}
        onClick={() => onDownload(FileFormat.XLSX)}>
        Export as XLSX
      </Button>
      <Button
        variant="success"
        startIcon={<DownloadIcon />}
        loading={loading === FileFormat.CSV}
        onClick={() => onDownload(FileFormat.CSV)}>
        Export as CSV
      </Button>
    </Fragment>
  );
};

export const FooterActions = memo(Component);
