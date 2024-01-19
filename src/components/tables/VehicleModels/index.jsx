import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// import CarModelOptions from '../../../containers/Management/vehicleModels/CarModelOptions';
import formatRowData from './formatRowData';
import getTableColumns from './getTableColumns';
//
import RTTable from 'components/ui/Table/RTTable';

function VehicleModelsTable(props) {
  const { vehicleModels, loading, error, ...tableProps } = props;
  // console.log({ vehicleModels });

  const orgId = useSelector(state => state?.orgsReducer?.org?._id);

  const columns = useMemo(() => {
    const tableColumns = getTableColumns();

    return [...tableColumns];
  }, []);

  const data = useMemo(() => {
    let models = [];

    if (Array.isArray(vehicleModels)) {
      models = vehicleModels.map(model => {
        const itemTableData = formatRowData(model, orgId);

        return {
          ...itemTableData,
        };
      });
    }

    return models;
  }, [vehicleModels, orgId]);

  return (
    <RTTable
      columns={columns}
      data={data}
      //status
      loading={loading}
      error={error}
      //pagination
      showPagination={false}
      //

      {...tableProps}
    />
  );
}

VehicleModelsTable.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  vehicleModels: PropTypes.arrayOf(
    PropTypes.shape({
      make: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
      years: PropTypes.string.isRequired,
    })
  ),
};

export default VehicleModelsTable;
