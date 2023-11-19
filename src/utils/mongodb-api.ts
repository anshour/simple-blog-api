const mongodbApi = {
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

  async insertOne(body = {}) {
    return this.request("/action/insertOne", body);
  },
  async findOne(body = {}) {
    return this.request("/action/findOne", body);
  },
  async updateOne(body = {}) {
    return this.request("/action/updateOne", body);
  },
  async deleteOne(body = {}) {
    return this.request("/action/deleteOne", body);
  },
  async insertMany(body = {}) {
    return this.request("/action/insertMany", body);
  },
  async findMany(body = {}) {
    return this.request("/action/findMany", body);
  },
  async updateMany(body = {}) {
    return this.request("/action/updateMany", body);
  },
  async deleteMany(body = {}) {
    return this.request("/action/deleteMany", body);
  },
  async aggregate(body = {}) {
    return this.request("/action/aggregate", body);
  },
};

export default mongodbApi;
