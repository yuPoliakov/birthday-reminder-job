import { MongoClient } from "mongodb";

let db, client;

function getURIMapping(dbConfig) {
    return {
        prod: `mongodb+srv://${dbConfig.user}:${dbConfig.pass}@${dbConfig.host}/${dbConfig.db}?retryWrites=true&w=majority`,
        dev:`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`
    };   
}

const connect = async (config) => {
    const uri = getURIMapping(config)[process.env.ENV];

    client = new MongoClient(uri);
    await client.connect();

    db = client.db(config.db);
}

const createOrUpdate = async (email, reminders) => {
    return db.collection('users').updateOne(
        { email: email.toLowerCase() },
        { $push: { reminders: reminders } },
        { upsert: true }
    );
}

const find = async (email) => {
    return db.collection('users').findOne({ email: email });
}

const findAll = async (filter) => {
    return await db.collection('users').find(filter).toArray();
}

const deleteOne = async () => {
    return db.collection('users').deleteOne({ email });
}

const close = async () => {
    return client.close();
}

export default {
    connect,
    close,
    find,
    findAll,
    createOrUpdate,
    deleteOne
};
