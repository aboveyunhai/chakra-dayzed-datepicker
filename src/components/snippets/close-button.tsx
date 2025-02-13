import type { ButtonProps as ChakraCloseButtonProps } from '@chakra-ui/react';
import { IconButton as ChakraIconButton } from '@chakra-ui/react';
import React from 'react';
import { LuX } from '../lux-icon';

export interface CloseButtonProps extends ChakraCloseButtonProps {}

export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  CloseButtonProps
>(function CloseButton(props, ref) {
  return (
    <ChakraIconButton variant="ghost" aria-label="Close" ref={ref} {...props}>
      {props.children ?? <LuX />}
    </ChakraIconButton>
  );
});
