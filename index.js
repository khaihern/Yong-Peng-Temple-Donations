const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SK);


const app = express();
app.use(express.static('public'));

stripe.balanceTransactions.list(function(err, balanceTransactions) {
  console.log(balanceTransactions)
});


/*
stripe.balance.retrieve(function(err, balance) {
  console.log(balance);
});
*/

app.listen(4242, () => console.log('Running on port 4242'));