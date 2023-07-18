import React, {memo} from 'react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Flex,
  Typography,
} from '@strapi/design-system';
import {CheckCircle, Trash} from '@strapi/icons';
import IconContainer from '../IconContainer';

enum Type {
  danger,
  success,
}

const Component = (props: {
  onClose: (confirm: boolean) => void;
  isVisible: boolean;
  description?: string;
  type?: Type;
}) => {
  const buttonIcons = {
    [Type.danger]: <Trash />,
    [Type.success]: <CheckCircle />,
  };

  const dialogIcons = {
    [Type.success]: <CheckCircle />,
  };

  return (
    <Dialog
      onClose={() => props.onClose(false)}
      title="Confirmation"
      isOpen={props.isVisible}>
      <DialogBody
        icon={
          <IconContainer>
            {dialogIcons[props.type || Type.success]}
          </IconContainer>
        }>
        <Flex direction="column" alignItems="center" gap={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">
              {props.description ||
                'Are you sure you want to send Notification to all users?'}
            </Typography>
          </Flex>
        </Flex>
      </DialogBody>
      <DialogFooter
        startAction={
          <Button onClick={() => props.onClose(false)} variant="tertiary">
            Cancel
          </Button>
        }
        endAction={
          <Button
            variant="success-light"
            startIcon={buttonIcons[props.type || Type.success]}
            onClick={() => props.onClose(true)}>
            Confirm
          </Button>
        }
      />
    </Dialog>
  );
};

export const ConfirmationModal = memo(Component);
