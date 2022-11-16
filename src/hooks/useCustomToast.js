import { useToast, UseToastOptions } from '@chakra-ui/react';

function useCustomToast() {
  const toast = useToast();

  /**
   * @param {string} message
   * @param {UseToastOptions} options
   */
  function showToast(message, options) {
    return toast({
      duration: 9000,
      position: 'bottom-left',
      isClosable: true,
      status: 'success',
      variant: 'subtle',
      ...options,
      description: message,
    });
  }

  return { showToast };
}

export default useCustomToast;
