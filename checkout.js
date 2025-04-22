
// Initialize Stripe
const stripe = Stripe('YOUR_PUBLISHABLE_KEY');
const elements = stripe.elements();

// Create card Element
const card = elements.create('card', {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
});

// Mount card Element
card.mount('#card-element');

// Handle validation errors
card.addEventListener('change', ({error}) => {
  const displayError = document.getElementById('card-errors');
  if (error) {
    displayError.textContent = error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission
const form = document.getElementById('payment-form');
const submitButton = form.querySelector('button');
const spinner = document.getElementById('spinner');
const buttonText = document.getElementById('button-text');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  // Disable button and show spinner
  submitButton.disabled = true;
  spinner.classList.remove('hidden');
  buttonText.classList.add('hidden');

  try {
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: card,
      billing_details: {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
      }
    });

    if (error) {
      throw error;
    }

    // Here you would normally send the paymentMethod.id to your server
    // and create a payment intent
    alert('Bestelling succesvol! U ontvangt een bevestigingsmail.');
    form.reset();
    
  } catch (error) {
    const errorElement = document.getElementById('card-errors');
    errorElement.textContent = error.message;
  }

  // Re-enable button and hide spinner
  submitButton.disabled = false;
  spinner.classList.add('hidden');
  buttonText.classList.remove('hidden');
});
