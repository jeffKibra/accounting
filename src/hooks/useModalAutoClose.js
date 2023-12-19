import { useCallback, useState } from 'react';

export default function useModalAutoClose(onConfirm, onClose) {
  const [isCalled, setIsCalled] = useState(false);

  const handleConfirm = useCallback(
    async (...params) => {
      setIsCalled(true);
      try {
        await onConfirm(...params);

        onClose();
      } catch (error) {
        console.error(error);
      }
    },
    [onConfirm, onClose]
  );

  return {
    handleConfirm,
    isCalled,
  };
}
