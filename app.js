const express = require('express');
const storyRoutes = require('./routes/story');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use('/api/story', storyRoutes);

app.get('/', (req, res) => {
  res.render('index');
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});