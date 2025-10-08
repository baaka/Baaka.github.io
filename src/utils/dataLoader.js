// Utility to load all JSON data files dynamically
const dataContext = require.context("../assets/data", false, /\.json$/);

const loadAllData = () => {
  const data = [];
  dataContext.keys().forEach((key) => {
    const jsonData = dataContext(key);
    data.push(jsonData);
  });
  return data;
};

export default loadAllData;
