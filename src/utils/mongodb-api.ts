// * USING AXIOS
// import axios from "axios";

// const httpDb = axios.create({
//   baseURL: process.env.MONGDB_ENDPOINT_URL,
//   headers: {
//     "Content-Type": "application/json",
//     "api-key": process.env.MONGODB_API_KEY,
//   },
// });

// httpDb.interceptors.request.use(
//   function (config) {
//     config.data = {
//       ...config.data,
//       dataSource: process.env.MONGODB_DATASOURCE,
//       database: process.env.MONGODB_DATABASE,
//     };
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// * USING FETCH
const httpDb = {
  baseURL: process.env.MONGDB_ENDPOINT_URL!,
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.MONGODB_API_KEY!,
  },
  dataSource: process.env.MONGODB_DATASOURCE!,
  database: process.env.MONGODB_DATABASE!,

  async request(endpoint: string, body = {}) {
    const url = this.baseURL + endpoint;
    const defaultHeaders = this.headers;

    const defaultBody = {
      dataSource: this.dataSource,
      database: this.database,
    };

    const config = {
      method: "POST",
      headers: {
        ...defaultHeaders,
      },
      body: JSON.stringify({
        ...defaultBody,
        ...body,
      }),
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

// Usage example:
// httpDb.request('/some-endpoint', { method: 'POST', body: JSON.stringify({ some: 'data' }) });

//TODO: ADD MONGODB ACTION
// mongodbApiClient.findOne = async ( data) => {
//   try {
//     const response = await mongodbApiClient.post('/action/findOne' ,data);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export default httpDb;
