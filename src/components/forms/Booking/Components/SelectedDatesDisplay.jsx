import { Stack, Heading, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
import Editable from './Editable';

//----------------------------------------------------------------
SelectedDatesDisplay.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

export function SelectedDatesDisplay(props) {
  const { startDate, endDate } = props;

  return (
    <Editable>
      <DateDisplay
        title="Pick up Date"
        value={new Date(startDate).toDateString()}
      />
      <DateDisplay
        title="Return Date"
        value={new Date(endDate).toDateString()}
      />
    </Editable>
  );
}

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
  ...CustomDisplayProps,
};

DateDisplay.defaultProps = {
  direction: 'column',
  spacing: 0,
};

export function DateDisplay(props) {
  return <CustomDisplay {...props} />;
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
