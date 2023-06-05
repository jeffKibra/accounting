import { useEffect } from 'react';

import { InputGroup, Input, InputRightElement } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import SKUOptions from './SKUOptions';
//
import { createSKU } from 'functions';

//--------------------------------------------------------------------------

SKUInput.propTypes = {
  sourceField: PropTypes.string.isRequired,
};

SKUInput.defaultProps = {
  sourceField: 'name',
};

export default function SKUInput(props) {
  const { sourceField } = props;

  const { register, watch, setValue } = useFormContext();

  const skuOption = watch('skuOption');
  const sourceValue = watch(sourceField);

  useEffect(() => {
    if (skuOption === 'auto') {
      const autoSKU = createSKU(sourceValue);
      // console.log({ name, variant, id });

      setValue('sku', autoSKU);
    }
  }, [sourceValue, setValue, skuOption]);

  return (
    <InputGroup>
      <Input
        id="sku"
        {...register('sku', {
          required: { value: true, message: '*Required!' },
        })}
        pr="40px"
      />

      <InputRightElement>
        <SKUOptions name="skuOption" defaultValue="auto" />
      </InputRightElement>
    </InputGroup>
  );
}
