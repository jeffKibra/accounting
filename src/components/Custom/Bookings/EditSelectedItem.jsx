import { useFormContext } from 'react-hook-form';
import { Heading, Text } from '@chakra-ui/react';

//
import ItemSelectorModal from './ItemSelectorModal';
//
//
import Editable from './Editable';

function EditSelectedItem(props) {
  //   console.log({ orgId });

  const { watch } = useFormContext();

  const item = watch('item');

  const carModel = item?.model || {};

  return (
    <ItemSelectorModal>
      {openModal => {
        return (
          <Editable onEditToggle={openModal} isEditing={false}>
            <>
              <Heading mt={-4} textTransform="uppercase">
                {item?.name || ''}
              </Heading>
              <Text>{`${carModel?.make} ${carModel?.model} (${item?.year})`}</Text>
            </>
          </Editable>
        );
      }}
    </ItemSelectorModal>
  );
}

export default EditSelectedItem;
