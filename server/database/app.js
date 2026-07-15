const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());

const reviews_data = JSON.parse(fs.readFileSync('./data/reviews.json', 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync('./data/dealerships.json', 'utf8'));

mongoose.connect('mongodb://mongo_db:27017/dealershipsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Review = require('./review');
const Dealership = require('./dealership');

try {
  Review.deleteMany({}).then(() => {
    Review.insertMany(reviews_data.reviews);
  });
  Dealership.deleteMany({}).then(() => {
    Dealership.insertMany(dealerships_data.dealerships);
  });
} catch (error) {
  console.error('Error initializing data collections:', error);
}

app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Review.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Review.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error filtering reviews by dealer ID' });
  }
});

app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealership.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships list' });
  }
});

app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const documents = await Dealership.find({ state: req.params.state });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error filtering dealerships by state' });
  }
});

app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const document = await Dealership.findOne({ id: req.params.id });
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealer details profile' });
  }
});

app.post('/insert_review', async (req, res) => {
  try {
    const data = req.body;
    const documents = await Review.find().sort({ id: -1 });
    const new_id = documents.length > 0 ? documents[0].id + 1 : 1;

    const review = new Review({
      id: new_id,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year,
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    res.status(500).json({ error: 'Error submitting new data review' });
  }
});

app.listen(port, () => {
  console.log('Express microservice backend listening on port ' + port);
});
