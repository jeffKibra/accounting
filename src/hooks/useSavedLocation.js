import { useLocation } from 'react-router-dom';

function useSavedLocation() {
  const location = useLocation();

  function setLocation() {
    localStorage.setItem('location', JSON.stringify(location));
  }

  function getLocation() {
    return JSON.parse(localStorage.getVehicle('location'));
  }

  return {
    setLocation,
    getLocation,
  };
}

export default useSavedLocation;
