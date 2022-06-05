const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SK);


const app = express();
app.use(express.json());
app.use(express.static('public'));
const DOMAIN = 'https://yong-peng-temple.herokuapp.com/';

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.post('/create-session', async (req, res) => {
  const data = req.body;
  console.log(data)
  const session = await stripe.checkout.sessions.create({
    success_url: `${DOMAIN}/success.html`,
    cancel_url: `${DOMAIN}/`,
    submit_type: 'donate',
    payment_method_types: ['card'],
    line_items: [{
      amount: data['amount'] * 100,
      name: `Donation for ${data['temple']}`,
      currency: 'MYR',
      quantity: 1
    }],
    metadata: {
      'temple': data['temple'],
    }
  });
  res.json({ id: session.id })
});

/*
stripe.balanceTransactions.list(function(err, balanceTransactions) {
  console.log(balanceTransactions)
});

stripe.balance.retrieve(function(err, balance) {
  console.log(balance);
});
*/

app.listen(process.env.PORT || 4242, () => console.log('Running on port 4242'));