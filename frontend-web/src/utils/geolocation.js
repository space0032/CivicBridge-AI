import logger from './logger';

export const getGeolocation = (timeout = 10000) => {
  // ... (keep getGeolocation as is, need to be careful with range)
  // Actually I should just replace the whole file to be safe or use multi_replace.
  // Let's use replace_file_content but I need to include the top import.
  // I'll replace from line 1 to 61.

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: timeout,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;

          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
            break;
        }
        logger.error("Geolocation error:", error);
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Validate inputs
  const isValid = (val, min, max) => typeof val === 'number' && !isNaN(val) && val >= min && val <= max;

  if (!isValid(lat1, -90, 90) || !isValid(lon1, -180, 180) ||
    !isValid(lat2, -90, 90) || !isValid(lon2, -180, 180)) {
    logger.error("Invalid coordinates provided to calculateDistance:", { lat1, lon1, lat2, lon2 });
    return null;
  }

  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
