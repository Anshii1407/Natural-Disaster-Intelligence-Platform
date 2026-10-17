export const validateCoordinates = (coords) => {
  if (!Array.isArray(coords) || coords.length !== 2) {
    return false;
  }
  const [lon, lat] = coords;
  return (
    typeof lon === 'number' &&
    typeof lat === 'number' &&
    lon >= -180 &&
    lon <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
};

export const requireFields = (fields = []) => {
  return (req, res, next) => {
    const missing = [];
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing Required Fields',
        missingFields: missing,
      });
    }

    next();
  };
};
