import React, {memo} from 'react';
import {Button} from '@strapi/design-system';
import {ComponentEnum} from '../../../model';
import {DownloadIcon} from '../../Icons/Download';

const FooterActions = (props: {
  action: (type: ComponentEnum) => void;
  loading: ComponentEnum;
}) => {
  const {action, loading} = props;

  return (
    <>
      <Button
        variant="success"
        startIcon={<DownloadIcon />}
        loading={loading === ComponentEnum.free_text}
        onClick={() => action(ComponentEnum.free_text)}>
        Normal Report
      </Button>
      <Button
        variant="success"
        startIcon={<DownloadIcon />}
        loading={loading === ComponentEnum.rating}
        onClick={() => action(ComponentEnum.rating)}>
        Rating Report
      </Button>
    </>
  );
};

export default memo(FooterActions);
