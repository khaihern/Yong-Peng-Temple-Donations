const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SK);


const app = express();
app.use(express.json());
app.use(express.static('public'));
const DOMAIN = 'https://yong-peng-temple-donations--khai_hernhern.repl.co';

app.get('/donation-data', async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();
    const customers = await stripe.customers.list();
    const charges = await stripe.charges.list();
    charges.data.map((item) => {
      console.log(item.billing_details.name);
    });

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        data: {
          balance: balance.pending[0].amount,
          people: charges.data.length
        }
      });
  } catch (err) {
    res.status(404).json({
        status: 'fail',
        message: err
      });
  }
});

app.get('/get-balance', async (req, res) => { 
  const balance = await stripe.balance.retrieve();
  console.log(balance.pending[0].amount);
}); 

app.post('/create-session', async (req, res) => {
  const data = req.body;
  console.log(data)
  const session = await stripe.checkout.sessions.create({
    success_url: `${DOMAIN}/success.html`,
    cancel_url: `${DOMAIN}/`,
    submit_type: 'donate',
    payment_method_types: ['card', 'alipay'],
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
*/


app.listen(4242, () => console.log('Running on port 4242'));