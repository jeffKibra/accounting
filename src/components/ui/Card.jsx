import { Box, Heading } from "@chakra-ui/react";

export default function Card({ children }) {
  return (
    <Box w="full" bg="card" borderRadius={4} shadow="md">
      {children}
    </Box>
  );
}

export function CardContent({ children }) {
  return <Box p={4}>{children}</Box>;
}

export function CardHeader({ children }) {
  return (
    <Heading p={4} as="h3" fontSize={24}>
      {children}
    </Heading>
  );
}

export function CardActions({ children }) {
  return <Box p={4}>{children}</Box>;
}
