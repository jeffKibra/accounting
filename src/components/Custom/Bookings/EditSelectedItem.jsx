import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Heading, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

//
// import ItemSelectorModal from './ItemSelectorModal';
//
//
import Editable from './Editable';

function EditSelectedItem(props) {
  //   console.log({ orgId });

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const { watch } = useFormContext();

  const item = watch('item');
  // console.log({ item });

  const carModel = item?.model || {};
  const year = item?.year || '';

  const handleEdit = useCallback(() => {
    navigate(`${pathname}?stage=1`);
  }, [pathname, navigate]);

  return (
    <Editable onEditToggle={handleEdit} isEditing={false}>
      <>
        <Heading mt={-4} textTransform="uppercase">
          {item?.registration || ''}
        </Heading>
        <Text>{`${carModel?.make} ${carModel?.model} ${
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
  //             <Text>{`${carModel?.make} ${carModel?.model} (${item?.year})`}</Text>
  //           </>
  //         </Editable>
  //       );
  //     }}
  //   </ItemSelectorModal>
  // );
}

export default EditSelectedItem;
