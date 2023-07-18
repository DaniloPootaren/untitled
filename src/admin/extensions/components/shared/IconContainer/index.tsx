import styled from 'styled-components';
import {Box} from '@strapi/design-system';

const IconContainer = styled(Box)`
  svg {
    width: ${({theme}) => theme.spaces[6]};
    height: ${({theme}) => theme.spaces[6]};

    path {
      fill: ${({theme}) => theme.colors.success600};
    }
  }
`;

export default IconContainer;
