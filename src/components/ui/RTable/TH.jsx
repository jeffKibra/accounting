import { Th, Box, Icon, Text } from '@chakra-ui/react';
import { RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri';
import PropTypes from 'prop-types';

export default function TH(props) {
  const {
    children,
    onClick,
    isNumeric,
    isSorted,
    isSortedDesc,
    ...headerProps
  } = props;
  // console.log({ headerProps });

  function handleClick(e) {
    onClick(e);
  }

  return (
    <Th onClick={handleClick} role="group" isNumeric={true} {...headerProps}>
      {/* {children} */}
      <Box
        as="span"
        display="flex"
        alignItems="center"
        flexDir={isNumeric ? 'row' : 'row-reverse'}
        justifyContent={isNumeric ? 'flex-start' : 'flex-end'}
        {...(isNumeric ? { width: 'fit-content', ml: 'auto' } : {})}
        role="group"
      >
        <ArrowIcon
          isSorted={isSorted}
          direction={isSortedDesc ? 'desc' : 'asc'}
        />
        <Text>{children}</Text>
      </Box>
    </Th>
  );
}

TH.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func.isRequired,
  isNumeric: PropTypes.bool,
  isSorted: PropTypes.bool,
  isSortedDesc: PropTypes.bool,
};

function ArrowIcon(props) {
  const { isSorted, direction } = props;
  return (
    <Icon
      as={direction === 'desc' ? RiArrowDownLine : RiArrowUpLine}
      mr={1}
      display={isSorted ? 'block' : 'none'}
      _groupHover={{
        display: 'block',
      }}
    />
  );
}

ArrowIcon.propTypes = {
  isSorted: PropTypes.bool,
  direction: PropTypes.oneOf(['asc', 'desc']),
};
