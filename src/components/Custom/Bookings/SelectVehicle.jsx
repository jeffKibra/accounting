import { useCallback, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
import ItemsTable from 'components/tables/Items/ItemsTable';
//
import { SearchItemsContextProvider } from 'contexts/SearchItemsContext';
//
import SelectedVehiclePreview from './SelectedVehiclePreview';

//
// import ItemsLoader from 'components/forms/Booking/ItemsLoader';

function SelectVehicle(props) {
  const { onSelect, bookingId, selectedVehicle, selectedDatesString } = props;

  // console.log('updating Select Vehicle component!');

  // const { getQueryVariables } = useContext(SearchItemsContext);
  // // const queryVariables = watch('queryVariables');

  useEffect(() => {
    console.log('selectedDates have changed', selectedDatesString);
  }, [selectedDatesString]);

  const handleVehicleSelect = useCallback(
    incomingVehicle => {
      if (incomingVehicle) {
        try {
          delete incomingVehicle?.searchScore;
          delete incomingVehicle?.carModel;
          delete incomingVehicle?.tax;
          delete incomingVehicle?.__typename;
          delete incomingVehicle?.model?.__typename;
        } catch (error) {
          console.error(error);
        }
      }

      // updateVehicleSelection(incomingVehicle);

      //call passed cb
      onSelect(incomingVehicle);
      //
      // navigate(`${pathname}?stage=2`);
    },
    [
      onSelect,
      // updateVehicleSelection
    ]
  );

  const handleClearSelection = useCallback(() => {
    handleVehicleSelect(null);
  }, [handleVehicleSelect]);

  //----------------------------------------------------------------
  // console.log({ queryVariables });

  return (
    <SearchItemsContextProvider
      selectedDatesString={selectedDatesString}
      // defaultValues={queryVariables}
      bookingId={bookingId}
    >
      {selectedDatesString?.length > 0 ? (
        <Box mx={-4}>
          <ItemsTable
            emptyMessage="No Vehicle is available for booking on the selected Dates!"
            onRowClick={handleVehicleSelect}
            itemIdToHighlight={selectedVehicle?._id || ''}
          />
        </Box>
      ) : (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Date Range Error!</AlertTitle>
          <AlertDescription>
            Select a Valid Date Range to continue... End Date must be the same
            or ahead of Start Date
          </AlertDescription>
        </Alert>
      )}

      <SelectedVehiclePreview
        selectedVehicle={selectedVehicle}
        onClearSelection={handleClearSelection}
      />
    </SearchItemsContextProvider>
  );
}

SelectVehicle.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedDatesString: PropTypes.string.isRequired,
  selectedVehicle: PropTypes.object,
  bookingId: PropTypes.string,
};

export default SelectVehicle;

// function VehicleSelector(props) {
//   const {
//     onSelect,
//     // preselectedItemId,
//     // preselectedDates,
//     watch,
//     setValue,
//     bookingId,
//   } = props;

//   console.log('updating Select Vehicle component!');

//   // const { getQueryVariables } = useContext(SearchItemsContext);

//   const selectedDates = watch('selectedDates');
//   const queryVariables = watch('queryVariables');
//   const vehicle = watch('vehicle');
//   // console.log({ selectedDates, queryVariables });

//   useEffect(() => {
//     console.log('selectedDates have changed', selectedDates);
//   }, [selectedDates]);

//   const updateForm = useCallback(
//     (selectedVehicle, incomingQueryVariables) => {
//       // console.log({ item });
//       const rate = selectedVehicle?.rate || 0;

//       setValue('vehicle', selectedVehicle);
//       setValue('queryVariables', incomingQueryVariables);
//       // //update rate and reset transfer rate
//       setValue('bookingRate', rate, {
//         shouldValidate: true,
//         shouldDirty: true,
//       });
//     },
//     [setValue]
//   );

//   // const updateVehicleSelection = useCallback(
//   //   selectedVehicle => {
//   //     const incomingQueryVariables = getQueryVariables();
//   //     // console.log('handling vehicle selection in form', {
//   //     //   selectedVehicle,
//   //     //   incomingQueryVariables,
//   //     // });

//   //     updateForm(selectedVehicle, incomingQueryVariables);
//   //   },
//   //   [updateForm, getQueryVariables]
//   // );
//   const updateVehicleSelection = useCallback(
//     selectedVehicle => {
//       updateForm(selectedVehicle);
//     },
//     [updateForm]
//   );

//   const handleVehicleSelect = useCallback(
//     selectedVehicle => {
//       try {
//         delete selectedVehicle?.__typename;
//         delete selectedVehicle?.searchScore;
//         delete selectedVehicle?.model?.__typename;
//         delete selectedVehicle?.carModel;
//         delete selectedVehicle?.tax;
//       } catch (error) {
//         console.error(error);
//       }

//       updateVehicleSelection(selectedVehicle);

//       //call passed cb
//       typeof onSelect === 'function' && onSelect(selectedVehicle);
//       //
//       // navigate(`${pathname}?stage=2`);
//     },
//     [onSelect, updateVehicleSelection]
//   );

//   const handleClearSelection = useCallback(() => {
//     updateVehicleSelection(null);
//   }, [updateVehicleSelection]);

//   //----------------------------------------------------------------
//   // console.log({ queryVariables });

//   return (
//     <SearchItemsContextProvider
//       selectedDatesString={selectedDates}
//       // defaultValues={queryVariables}
//       bookingId={bookingId}
//     >
//       {selectedDates?.length > 0 ? (
//         <Box mx={-4}>
//           {/* <ItemsLoader
//             onItemSelect={handleVehicleSelect}
//             selectedItem={vehicle}
//             selectedDates={selectedDates}
//             preselectedItemId={preselectedItemId}
//             preselectedDates={preselectedDates}
//           /> */}
//           <ItemsTable
//             emptyMessage="No Vehicle is available for booking on the selected Dates!"
//             onRowClick={handleVehicleSelect}
//             itemIdToHighlight={vehicle?._id || ''}
//           />
//         </Box>
//       ) : (
//         <Alert status="error">
//           <AlertIcon />
//           <AlertTitle>Date Range Error!</AlertTitle>
//           <AlertDescription>
//             Select a Valid Date Range to continue... End Date must be the same
//             or ahead of Start Date
//           </AlertDescription>
//         </Alert>
//       )}

//       <SelectedVehiclePreview
//         selectedVehicle={vehicle}
//         onClearSelection={handleClearSelection}
//       />
//     </SearchItemsContextProvider>
//   );
// }

// VehicleSelector.propTypes = {
//   onSelect: PropTypes.func.isRequired,
//   preselectedItemId: PropTypes.string,
//   preselectedDates: PropTypes.array,
//   watch: PropTypes.func.isRequired,
//   setValue: PropTypes.func.isRequired,
//   bookingId: PropTypes.string,
// };

// VehicleSelector.defaultProps = {
//   onSelect: () => {},
//   preselectedItemId: '',
//   preselectedDates: [],
// };
