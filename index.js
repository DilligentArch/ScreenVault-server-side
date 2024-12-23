const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middwere
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2x9eo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const movieCollection = client.db('MovieDB').collection('movies')
    app.post('/movies', async (req, res) => {
      const newMovie = req.body;
      const result = await movieCollection.insertOne(newMovie);
      res.send(result);
    });

    app.get('/movies', async (req, res) => {
      const cursor = movieCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/movies/top-rated', async (req, res) => {

      const cursor = movieCollection.find().sort({ rating:-1 }).limit(6);

      const result = await cursor.toArray();
      res.send(result);

    });
    app.get('/movies/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await movieCollection.findOne(query);
      res.send(result);


    });
    app.delete('/movies/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await movieCollection.deleteOne(query);
      res.send(result);

    })


    app.put("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const review = req.body;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateReview = {
        $set: {
          poster: review.poster,
          title: review.title,
          summary: review. summary,
          rating: review.rating,
          releaseYear: review.releaseYear,
          genre: review.genre,
          userEmail: review.userEmail,
          duration:review.duration
        
        },
      };

      const result = await movieCollection.updateOne(filter, updateReview, options);
      res.send(result);
    });


  
  
    
    
    
    
    










    //new database
    const movieCollection2 = client.db('MovieDB').collection('Favmovies')
    app.post('/favorites', async (req, res) => {
      const newMovie = req.body;
      const result = await movieCollection2.insertOne(newMovie);
      res.send(result);
    });
    app.get('/favorites/:email', async (req, res) => {
      const userEmail = req.params.email;
      const query = { userEmail }
      const result = await movieCollection2.find(query).toArray();
      res.send(result);


    });
    app.delete('/favorites/:id', async (req, res) => {
      const _id = req.params.id;
      const query = { _id }
      const result = await movieCollection2.deleteOne(query);
      res.send(result);

    });






    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Succesfull');

})
app.listen(port, () => {
  console.log("running")
})