import { Thead, Tr } from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
import TH from './TH';

export default function THead(props) {
  const { headers } = props;

  return (
    <Thead>
      <Tr>
        {headers.map(column => {
          // console.log({ column });
          const {
            render,
            getHeaderProps,
            getSortByToggleProps,
            isSorted,
            isSortedDesc,
          } = column;

          // console.log({ isSorted, isSortedDesc });
          const { isNumeric } = column;

          return (
            <TH
              isNumeric={isNumeric}
              isSorted={isSorted}
              isSortedDesc={isSortedDesc}
              {...getHeaderProps(getSortByToggleProps())}
            >
              {render('Header')}
            </TH>
          );
        })}
      </Tr>
    </Thead>
  );
}

THead.propTypes = {
  headers: PropTypes.array.isRequired,
};
