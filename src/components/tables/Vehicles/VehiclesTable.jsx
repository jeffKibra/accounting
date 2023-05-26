import { useMemo } from 'react';
import PropTypes from 'prop-types';

import VehicleOptions from '../../../containers/Management/Vehicles/VehicleOptions';

import CustomTable from '../CustomTable';

function createTaxDisplay(tax) {
  return tax?.name ? `${tax?.name} (${tax?.rate}%)` : '';
}

function VehicleTable(props) {
  const { vehicles } = props;
  // console.log({ vehicles });

  const columns = useMemo(() => {
    return [
      { Header: 'Name', accessor: 'name' },
      { Header: 'SKU', accessor: 'sku' },
      { Header: 'Type', accessor: 'type' },
      { Header: 'Rate', accessor: 'sellingPrice', isNumeric: true },
      { Header: 'Cost', accessor: 'costPrice', isNumeric: true },
      { Header: 'Tax', accessor: 'tax' },
      { Header: '', accessor: 'actions', isNumeric: true, width: '1%' },
    ];
  }, []);

  const data = useMemo(() => {
    return vehicles.map(vehicle => {
      return {
        ...vehicle,
        tax: createTaxDisplay(vehicle?.salesTax),
        actions: <VehicleOptions vehicle={vehicle} edit view deletion />,
      };
    });
  }, [vehicles]);

  return <CustomTable data={data} columns={columns} />;
}

VehicleTable.propTypes = {
  vehicles: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      unit: PropTypes.string,
      description: PropTypes.string,
      sku: PropTypes.string,
      vehicleId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['goods', 'services', 'vehicle']).isRequired,
      costPrice: PropTypes.number.isRequired,
      sellingPrice: PropTypes.number.isRequired,
      salesTax: PropTypes.object,
    })
  ),
  deleting: PropTypes.bool.isRequired,
  isDeleted: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default VehicleTable;
