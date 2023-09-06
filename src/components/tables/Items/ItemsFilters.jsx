import { useState, useMemo } from 'react';
import {
  IconButton,
  Button,
  Flex,
  HStack,
  Input,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  FormHelperText,
  Heading,
} from '@chakra-ui/react';
import { RiFilter3Line } from 'react-icons/ri';
import PropTypes from 'prop-types';
//
import { useCarModels } from 'hooks';
//
import SkeletonLoader from 'components/ui/SkeletonLoader';
import CustomAlert from 'components/ui/CustomAlert';
import CustomModal from 'components/ui/CustomModal';
import ControlledSelect from 'components/ui/ControlledSelect';
import ControlledNumInput from 'components/ui/ControlledNumInput';

function ItemsFilters({ onFilter }) {
  const [state, setState] = useState({
    make: '',
    model: '',
    year: '',
    type: '',
    color: '',
    rate_min: 0,
    rate_max: 0,
  });

  const { make, model, year, color, type, rate_min, rate_max } = state;

  function updateField(field, value) {
    setState(current => ({ ...current, [field]: value }));
  }

  function handleMakeChange(inValue) {
    setState(current => ({ ...current, make: inValue, model: '' }));
  }

  const { error, carModels, carMakes, carTypes, loading } = useCarModels();
  console.log({ carMakes, carModels });

  console.log({ carTypes });

  const models = useMemo(() => {
    let activeModels = {};

    if (carModels && typeof carModels === 'object' && make) {
      activeModels = carModels[make] || {};
    }

    return Object.keys(activeModels);
  }, [carModels, make]);

  console.log({ models });

  return (
    <CustomModal
      closeOnOverlayClick={false}
      renderTrigger={onOpen => (
        <IconButton
          size="sm"
          onClick={onOpen}
          title="filter items"
          icon={<RiFilter3Line />}
        />
      )}
      title={loading ? 'Loading Car Models...' : 'Set Filter Params'}
      renderContent={() => {
        return loading ? (
          <SkeletonLoader />
        ) : error ? (
          <CustomAlert
            status="error"
            title="Error Fetching Car models!"
            description={error?.message || 'Uknown Error!'}
          />
        ) : (
          <Grid rowGap={2} columnGap={4} templateColumns="repeat(2, 1fr)">
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel htmlFor="filter_items_make">Make</FormLabel>
                <ControlledSelect
                  allowClearSelection
                  id="filter_items_make"
                  value={make}
                  onChange={handleMakeChange}
                  options={(carMakes || []).map(make => {
                    return { name: make, value: make };
                  })}
                />
                <FormHelperText>Optional</FormHelperText>
              </FormControl>
            </GridItem>

            {models.length > 0 ? (
              <>
                {' '}
                <GridItem colSpan={1}>
                  <FormControl>
                    <FormLabel htmlFor="filter_items_model">Model</FormLabel>
                    <ControlledSelect
                      onChange={inValue => updateField('model', inValue)}
                      value={model}
                      id="filter_items_model"
                      options={models.map(modelStr => ({
                        name: modelStr,
                        value: modelStr,
                      }))}
                    />
                    <FormHelperText>Optional</FormHelperText>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl>
                    <FormLabel htmlFor="filter_items_year">Year</FormLabel>
                    <Input
                      placeholder="year"
                      id="filter_items_year"
                      value={year}
                      onChange={e =>
                        updateField('year', e?.target?.value || '')
                      }
                    />
                    <FormHelperText>Optional</FormHelperText>
                  </FormControl>
                </GridItem>
              </>
            ) : null}

            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel htmlFor="filter_items_car_type">Car Type</FormLabel>
                <ControlledSelect
                  onChange={inValue => updateField('type', inValue)}
                  value={type}
                  id="filter_items_car_type"
                  options={(carTypes || []).map(carType => ({
                    name: carType,
                    value: carType,
                  }))}
                />

                <FormHelperText>Optional</FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel htmlFor="filter_items_color">Color</FormLabel>
                <Input
                  placeholder="color"
                  id="filter_items_color"
                  value={color}
                  onChange={e => updateField('color', e?.target?.value || '')}
                />
                <FormHelperText>Optional</FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem colSpan={2} mb={-2} mt={4}>
              <Heading color="#888" size="sm" textTransform="uppercase">
                Price Range
              </Heading>
            </GridItem>

            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel htmlFor="filter_items_rate_min">Min</FormLabel>
                <ControlledNumInput
                  value={rate_min}
                  onChange={inValue => updateField('rate_min', inValue)}
                  id="filter_items_rate_min"
                />
                <FormHelperText>Optional</FormHelperText>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel htmlFor="filter_items_rate_max">Max</FormLabel>
                <ControlledNumInput
                  value={rate_max}
                  onChange={inValue => updateField('rate_max', inValue)}
                  id="filter_items_rate_max"
                  mode="onChange"
                />
                <FormHelperText>Optional</FormHelperText>
              </FormControl>
            </GridItem>
          </Grid>
        );
      }}
      renderFooter={onClose => {
        function handleClick() {
          onClose();
          onFilter(state);
        }

        return (
          <Flex w="full" justify="flex-end">
            <HStack spacing={4}>
              <Button type="button" onClick={onClose} colorScheme="red">
                close
              </Button>
              {loading ? null : (
                <Button type="button" onClick={handleClick} colorScheme="cyan">
                  apply
                </Button>
              )}
            </HStack>
          </Flex>
        );
      }}
    />
  );
}

ItemsFilters.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default ItemsFilters;
