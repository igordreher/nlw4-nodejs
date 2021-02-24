import { createConnection, getConnectionOptions } from 'typeorm';


export default async () => {
    const connectionOptions: any = await getConnectionOptions();
    const url = process.env.NODE_ENV === 'test' ? process.env.PG_URL : connectionOptions.url;
    return await createConnection({ ...connectionOptions, url: url });
};
