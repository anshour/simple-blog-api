//* SEE FULL POSSIBLE OPTIONS VISIT https://www.mongodb.com/docs/atlas/app-services/data-api/openapi/

interface BasicRequest {
  collection: string;
}

interface InsertOneRequest extends BasicRequest {
  document: Record<string, any>;
}

interface FindOneRequest extends BasicRequest {
  filter: Record<string, any>;
}

interface UpdateOneRequest extends BasicRequest {
  filter: Record<string, any>;
  update: Record<string, any>;
}

interface DeleteOneRequest extends BasicRequest {
  filter: Record<string, any>;
}

interface InsertManyRequest extends BasicRequest {
  documents: Record<string, any>[];
}

interface FindManyRequest extends BasicRequest {
  filter?: Record<string, any>;
  projection?: Record<string, any>;
  sort?: Record<string, number>;
  limit?: number;
  skip?: number;
}

interface UpdateManyRequest extends BasicRequest {
  filter?: Record<string, any>;
  update: Record<string, any>;
}

interface DeleteManyRequest extends BasicRequest {
  filter?: Record<string, any>;
}

interface AggregateRequest extends BasicRequest {
  pipeline: Record<string, any>[];
}

interface MongodbConfig {
  baseURL: string;
  apiKey: string;
  dataSource: string;
  database: string;
}

class MongodbAPI {
  constructor(private config: MongodbConfig) {}

  private async request<T extends BasicRequest>(endpoint: string, body: T): Promise<any> {
    const url = `${this.config.baseURL}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/ejson",
        "api-key": this.config.apiKey,
      },
      body: JSON.stringify({
        dataSource: this.config.dataSource,
        database: this.config.database,
        ...body,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorBody.error}`);
    }

    return response.json();
  }

  public insertOne(request: InsertOneRequest) {
    return this.request("/action/insertOne", request);
  }

  public findOne(request: FindOneRequest) {
    return this.request("/action/findOne", request);
  }

  public updateOne(request: UpdateOneRequest) {
    return this.request("/action/updateOne", request);
  }

  public deleteOne(request: DeleteOneRequest) {
    return this.request("/action/deleteOne", request);
  }

  public insertMany(request: InsertManyRequest) {
    return this.request("/action/insertMany", request);
  }

  public findMany(request: FindManyRequest) {
    return this.request("/action/findMany", request);
  }

  public updateMany(request: UpdateManyRequest) {
    return this.request("/action/updateMany", request);
  }

  public deleteMany(request: DeleteManyRequest) {
    return this.request("/action/deleteMany", request);
  }

  public aggregate(request: AggregateRequest) {
    return this.request("/action/aggregate", request);
  }
}

const mongodbApi = new MongodbAPI({
  baseURL: process.env.MONGODB_ENDPOINT_URL ?? "",
  apiKey: process.env.MONGODB_API_KEY ?? "",
  dataSource: process.env.MONGODB_DATASOURCE ?? "",
  database: process.env.MONGODB_DATABASE ?? "",
});

export default mongodbApi;
