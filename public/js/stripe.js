import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51KGlFeSG813J3020QW8J3gV5tb8eRt6yeWjtDXTuq5kbzHtdTNk0FXU97fR2bUP3dvNeevzBTovcVQLBEwCKVQsS001qvT3vbF  '
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
