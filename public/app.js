var stripe = Stripe('');
var button = document.getElementById('donate-button');
var amount = document.getElementById('amount-input');
var causes = document.getElementById('causes');
button.addEventListener('click', function(e) {
  e.preventDefault();
  fetch('/create-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amount.value,
      cause: causes.value,
    }),
  })
  .then((response) => response.json())
  .then((session) => {
    stripe.redirectToCheckout({
      sessionId: session.id
    });
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});