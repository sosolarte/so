require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/api/checkout', async (req, res) => {
  const { price_id } = req.body;

  if (!price_id) {
    return res.status(400).json({ error: 'Missing price_id' });
  }

  try {
    const response = await axios.post('https://api.lemonsqueezy.com/v1/checkouts', {
      checkout: {
        product_id: process.env.LEMON_PRODUCT_ID,
        custom_price: price_id
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.LEMON_API_KEY}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
    });

    const checkoutUrl = response.data.data.attributes.url;
    res.json({ url: checkoutUrl });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Checkout creation failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});