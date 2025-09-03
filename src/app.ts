import express from 'express'
import path from 'path'
import storyRoutes from './routes/story'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use('/api/story', storyRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});