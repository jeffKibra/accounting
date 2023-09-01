import { useState } from 'react';
import {
  Button,
  Box,
  // Switch,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
// import CustomSelect from '../../ui/CustomSelect';
import { fileHandling } from './files';

async function createCarModels() {
  const data = await fetchData(0);
  console.log({ data });

  await createFile(data);
}

async function createFile(data) {
  const buffer = await fileHandling._createBufferFromData(data);
  await fileHandling.downloadFile(buffer, 'carModels.json');
}

async function wait(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(console.log('waiting for ' + s + 'seconds...'));
    }, s * 1000);
  });
}

async function fetchData(page = 0) {
  await wait(1);

  console.log({ page });
  /**@type {[]} */
  const pageData = await fetchPageData(page, 50);
  console.log({ pageData });

  if (pageData.length > 0) {
    //call self recursively
    const nextPageData = await fetchData(page + 1);

    return pageData.concat(nextPageData);
  } else {
    return pageData;
  }
}

async function fetchPageData(page = 0, limit = 50) {
  const url = `https://car-data.p.rapidapi.com/cars?limit=${limit}&page=${page}`;
  const rawResp = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '289836bc86msh1560e457b847fc9p19c48fjsn62ad49a1772f',
      'X-RapidAPI-Host': 'car-data.p.rapidapi.com',
    },
  });
  const resp = await rawResp.json();

  console.log({ resp });

  return resp;
}

export default function CarModelForm(props) {
  const [loading, setLoading] = useState(false);

  async function createModels() {
    try {
      setLoading(true);
      console.log('fetching models');
      await createCarModels();

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box w="full">
      <Button
        colorScheme="cyan"
        isLoading={loading}
        onClick={createModels}
        mb={3}
      >
        start process
      </Button>
    </Box>
  );
}

CarModelForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  carModel: PropTypes.object,
};
