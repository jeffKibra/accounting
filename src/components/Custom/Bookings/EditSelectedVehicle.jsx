import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Heading, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

//
// import ItemSelectorModal from './ItemSelectorModal';
//
//
import Editable from './Editable';

function EditSelectedVehicle(props) {
  //   console.log({ orgId });

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const { watch } = useFormContext();

  const vehicle = watch('vehicle');
  // console.log({ item });

  const vehicleModel = vehicle?.model || {};
  const year = vehicleModel?.year || '';

  const handleEdit = useCallback(() => {
    navigate(`${pathname}?stage=1`);
  }, [pathname, navigate]);

  return (
    <Editable onEditToggle={handleEdit} isEditing={false}>
      <>
        <Heading mt={-4} textTransform="uppercase">
          {vehicle?.registration || ''}
        </Heading>
        <Text>{`${vehicleModel?.make || ''} ${vehicleModel?.name || ''} ${
          year ? `(${year})` : ''
        } `}</Text>
      </>
    </Editable>
  );

  // return (
  //   <ItemSelectorModal>
  //     {openModal => {
  //       return (
  //         <Editable onEditToggle={openModal} isEditing={false}>
  //           <>
  //             <Heading mt={-4} textTransform="uppercase">
  //               {item?.name || ''}
  //             </Heading>
  //             <Text>{`${vehicleModel?.make} ${vehicleModel?.model} (${item?.year})`}</Text>
  //           </>
  //         </Editable>
  //       );
  //     }}
  //   </ItemSelectorModal>
  // );
}

export default EditSelectedVehicle;
