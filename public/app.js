/*
var stripe = Stripe('pk_test_51IHZjJFiYjjy4smvJHT2Mn4lHX7o6kfDITCD2sG8cUegNvohNrtaLmItTz9NxsNTQEH1G0B1fpfYZ6FdrHJFa3lN00KgMNapHc');
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
*/

var stripeController = (function() {
  var stripe = Stripe('pk_test_51IIJoDJ9zaXhjVopbBdmyBC3CG4Wk4zxs7JlezJZGrllLe5NjDiqZRm7HgmAI4kRCwFJm6C4DxMq90T5mNS8HtKF00wkCvUWtk');
  
  return {
    checkout: function(input) {
      console.log(input['donateAmount'])
      fetch('/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: input['donateAmount'],
          temple: input['donateTemple'],
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
    }
  }
})();


var uiController = (function() {
  var DOMstrings = {
    amountBtn: '.amount-button',
    donateBtn: '#donate-button',
    donateTemple: '#temple-selection',
    amountOther: '#amount-other',
    amountValue: '#amount-value',
    amountText: '#amount-text',
    textInvalid: '#text-invalid'
  };

  var donateAmount = 25;
  var paymentSelection = 'preselect'; 

  return {
    validateForm: function() {
      if (paymentSelection == 'preselect') {
        return true;
      }

      var amount = document.querySelector(DOMstrings.amountText).value;
      amount = parseFloat(amount);
      console.log(amount);
      var RegExpDec = /^\d+(?:\.\d{1,2})?$/
      if (Number.isNaN(amount)) {
        document.querySelector(DOMstrings.textInvalid).innerHTML = 'There must be an amount';
        return false;
      } else if (amount < 2) {
        document.querySelector(DOMstrings.textInvalid).innerHTML = 'Amount must be more than RM2.00';
        return false;
      } else if (!(RegExpDec.test(amount))) {
        document.querySelector(DOMstrings.textInvalid).innerHTML = 'Amount must be a money value';
        return false;
      } else {
        document.querySelector(DOMstrings.textInvalid).innerHTML = '';
        return true;
      }
    },

    getInput: function() {
      if (paymentSelection == 'other') {
        donateAmount = document.querySelector(DOMstrings.amountText).value;
      } 

      return {
        donateAmount: donateAmount,
        donateTemple: document.querySelector(DOMstrings.donateTemple).value
      }
    },

    amountSet: function(value) {
      var x = document.querySelectorAll(DOMstrings.amountBtn)
      for (i = 0; i < x.length; i++) {
        x[i].classList.remove('selected');
      }
      if (value == 'other') {
        document.querySelector(DOMstrings.amountOther).style.display = 'none';
        document.querySelector(DOMstrings.amountValue).style.display = 'flex';
        paymentSelection = 'other';
      } else {
        document.querySelector(DOMstrings.amountOther).style.display = 'block';
        document.querySelector(DOMstrings.amountValue).style.display = 'none';
        document.querySelector(DOMstrings.textInvalid).innerHTML = '';
        paymentSelection = 'preselect'
        donateAmount = value;
      }
      document.querySelector(`#amount-${value}`).classList.add('selected');
      console.log(donateAmount);
    },  

    getDOMstrings: function() {
      return DOMstrings
    }
  }
})();


var controller = (function(stripeCtrl, uiCtrl) {
  var setupEventListeners = function() {
   var DOM = uiCtrl.getDOMstrings();
   document.querySelector(DOM.donateBtn).addEventListener('click', setupDonate);
  };

  var setupDonate = function() {
    validate = uiCtrl.validateForm();

    if (validate == true) {
      input = uiCtrl.getInput();
    } else {
      return false;
    }

    console.log('Ready to Donate :D');
    console.log(input);
    stripeCtrl.checkout(input);
  };

  return {
    init: function() {
      console.log('started');
      document.querySelector(`#amount-25`).classList.add('selected');
      setupEventListeners();
    }
  }
})(stripeController, uiController);

controller.init();