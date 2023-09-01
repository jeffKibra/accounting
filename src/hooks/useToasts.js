import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

function useToasts() {
  const toast = useToast();

  const success = useCallback(
    msg =>
      toast({
        duration: 9000,
        position: 'bottom-left',
        isClosable: true,
        status: 'success',
        variant: 'subtle',
        description: msg,
      }),
    [toast]
  );

  const info = useCallback(
    msg =>
      toast({
        duration: 9000,
        position: 'bottom-left',
        isClosable: true,
        status: 'info',
        variant: 'subtle',
        description: msg,
      }),
    [toast]
  );

  const error = useCallback(
    msg =>
      toast({
        duration: 9000,
        position: 'bottom-left',
        isClosable: true,
        status: 'error',
        variant: 'subtle',
        description: msg,
      }),
    [toast]
  );

  const warning = useCallback(
    msg =>
      toast({
        duration: 9000,
        position: 'bottom-left',
        isClosable: true,
        status: 'warning',
        variant: 'subtle',
        description: msg,
      }),
    [toast]
  );

  return {
    success,
    info,
    error,
    warning,
  };
}

export default useToasts;
