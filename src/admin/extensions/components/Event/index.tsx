import React, {memo, useState} from 'react';
import {EVENT_SLUG, VALID_PREFIX_NAME} from '../../constants/slugs';
import {useLocation} from 'react-router-dom';
import {Button} from '@strapi/design-system';
import {BellIcon} from '../Icons/Bell';
import {handleNotification} from '../../helpers/notification';
import {ConfirmationModal} from '../shared/Confirmation';
const {
  useCMEditViewDataManager,
  useNotification,
} = require('@strapi/helper-plugin');

const validPathName = `${VALID_PREFIX_NAME}${EVENT_SLUG}`;

const Component = () => {
  const location = useLocation();
  const displayButton = location.pathname.includes(validPathName);
  const {modifiedData} = useCMEditViewDataManager();
  const {publishedAt, id} = modifiedData;
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const toggleNotification = useNotification();

  if (!displayButton) {
    return <></>;
  }

  const sendNotification = async () => {
    try {
      setLoading(true);
      await handleNotification({
        id,
        notified: true,
      });
      toggleNotification({
        type: 'success',
        message: 'Notifications sent successfully',
      });
    } catch (e) {
      toggleNotification({
        type: 'warning',
        message: 'Notifications not sent!',
      });
    } finally {
      setLoading(false);
    }
  };

  const modalHandler = React.useCallback(async confirm => {
    setModal(false);
    if (confirm) {
      await sendNotification();
    }
  }, []);

  return (
    <>
      <ConfirmationModal onClose={modalHandler} isVisible={modal} />
      <Button
        variant={'success'}
        disabled={!publishedAt}
        startIcon={<BellIcon />}
        loading={loading}
        onClick={() => setModal(true)}>
        Notify Users
      </Button>
    </>
  );
};

export const EventComp = memo(Component);
