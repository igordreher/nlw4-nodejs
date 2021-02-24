import { createConnection, getConnectionOptions } from 'typeorm';


export default async () => {
    const connectionOptions: any = await getConnectionOptions();
    const dbURL = process.env.NODE_ENV === 'test' ?
        'postgres://test:password@pg-test/test' : connectionOptions.url;
    return await createConnection({ ...connectionOptions, url: dbURL });
};
