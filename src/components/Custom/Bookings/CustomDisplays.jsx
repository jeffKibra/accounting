import { Stack, Heading, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
//

//----------------------------------------------------------------

const CustomDisplayProps = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

CustomDisplay.propTypes = {
  ...CustomDisplayProps,
};

export function CustomDisplay(props) {
  const { value, title, ...moreProps } = props;

  return (
    <Stack pt={2} {...moreProps}>
      <Heading as="h4" size="xs">
        {title}:
      </Heading>
      <Text>{value}</Text>
    </Stack>
  );
}

//----------------------------------------------------------------

DateDisplay.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
};

DateDisplay.defaultProps = {
  direction: 'column',
  spacing: 0,
};

export function DateDisplay(props) {
  const { value, ...moreProps } = props;
  return (
    <CustomDisplay {...moreProps} value={new Date(value).toDateString()} />
  );
}

//----------------------------------------------------------------

NumberDisplay.propTypes = {
  ...CustomDisplayProps,
};

NumberDisplay.defaultProps = {
  direction: 'row',
  alignItems: 'center',
};

export function NumberDisplay(props) {
  return <CustomDisplay {...props} />;
}
