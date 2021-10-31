const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
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
        const bookedorder = database.collection("bookedOrder");
        const Traveloffer = database.collection("traveloffer");
        //GET data for booked API
        app.get('/booked', async (req, res) => {
            const cursor = bookedcollection.find({})
            const service = await cursor.toArray()
            console.log("get booked", service)
            res.send(service)
        })

        //GET data for bookedOrder api
        app.get('/bookedOrder', async (req, res) => {
            const cursor = bookedorder.find({})
            const order = await cursor.toArray()
            console.log("get order", order)
            res.send(order)

        })

        //POST API use add service in database
        app.post('/booked', async (req, res) => {
            const service = req.body
            console.log('hit the api', service)
            const result = await bookedcollection.insertOne(service)
            console.log(result)
            res.json(result)

        })

        //post api for booed order

        app.post('/bookedOrder', async (req, res) => {
            const order = req.body
            console.log("hitt api for order", order)
            const result = await bookedorder.insertOne(order)
            console.log(result)
            res.json(result)
        })

        //update api
        app.put('/bookedOrder/:id', async (req, res) => {
            const id = req.body
            const update = { _id: ObjectId(id) }

            const result = await bookedorder.updateOne(update)
            console.log('updateing order', id)
            res.json(result)

        })

        //Delete API
        app.delete('/bookedOrder/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bookedorder.deleteOne(query)
            console.log('deleteing order', id)
            res.json(result)
        })

        //GET Api for traveloffer data

        app.get('/traveloffer', async (req, res) => {
            const cursor = Traveloffer.find({})
            const offer = await cursor.toArray()
            console.log("get order", offer)
            res.send(offer)

        })




    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('travel booking server is running')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})