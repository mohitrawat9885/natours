import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_live_51KGlFeSG813J3020eR6iMG0xnQ28rkaieGoa4YtDaNW5gK2EGeHCKFkH6ymq80S7e4vjrYQv7QEuMlgWh3L2CvaR00k4yNchpS'
);

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
