import { VStack, Skeleton } from "@chakra-ui/react";

function SkeletonLoader() {
  return (
    <VStack bg="white" borderRadius="md" p={4} shadow="md" w="full">
      <Skeleton w="full" height="5" />
      <Skeleton w="full" height="5" />
      <Skeleton w="full" height="5" />
      <Skeleton w="full" height="5" />
    </VStack>
  );
}

export default SkeletonLoader;
