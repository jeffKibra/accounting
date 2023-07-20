import { useMemo } from 'react';
import PropTypes from 'prop-types';

import CarModelOptions from '../../../containers/Management/CarModels/CarModelOptions';

import CustomTable from '../CustomTable';

function CarModelsTable(props) {
  const { carModels } = props;
  // console.log({ carModels });

  const columns = useMemo(() => {
    return [
      { Header: 'Make', accessor: 'make' },
      { Header: 'Model', accessor: 'model' },
      { Header: 'Year', accessor: 'year', isNumeric: true },
      { Header: '', accessor: 'actions', isNumeric: true, width: '1%' },
    ];
  }, []);

  const data = useMemo(() => {
    return carModels.map(carModel => {
      return {
        ...carModel,
        actions: <CarModelOptions carModel={carModel} edit deletion />,
      };
    });
  }, [carModels]);

  return <CustomTable data={data} columns={columns} />;
}

CarModelsTable.propTypes = {
  carModels: PropTypes.arrayOf(
    PropTypes.shape({
      make: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
    })
  ),
  deleting: PropTypes.bool.isRequired,
  isDeleted: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default CarModelsTable;
