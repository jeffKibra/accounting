import { VStack, Skeleton } from '@chakra-ui/react';

function SkeletonLoader() {
  return (
    <VStack
      bg="white"
      p={4}
      w="full"
      // borderRadius="md"
      // shadow="md"
    >
      <Skeleton w="full" height="5" />
      <Skeleton w="full" height="5" />
      <Skeleton w="full" height="5" />
      <Skeleton w="full" height="5" />
    </VStack>
  );
}

export default SkeletonLoader;
