const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()
//middlare
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u5ucb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        console.log("connected to database")
        const database = client.db("travel-bokking");
        const bookedcollection = database.collection("booked");
        //GET data API
        app.get('/booked', async (req, res) => {
            const cursor = bookedcollection.find({})
            const service = await cursor.toArray()
            console.log("get booked", service)
            res.send(service)
        })

        //POST API use add service in database
        app.post('/booked', async (req, res) => {
            const service = req.body
            console.log('hit the api', service)
            const result = await bookedcollection.insertOne(service)
            console.log(result)
            res.json(result)

        })

    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('travel booking server is running late')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})