import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);



export const crearDonacion = async (req, res) => {

  console.log('Body recibido:', req.body);
  const { monto } = req.body;

  if (!monto) {
    return res.status(400).json({ error: 'Falta el monto en la petición' });
  }

  
  try {
    const session = await stripe.checkout.sessions.create({
      
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donación al Museo Gustavo Orcés',
            },
            unit_amount: req.body.monto * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://zayenda.netlify.app/donations/success',
      cancel_url: 'https://zayenda.netlify.app/donations/cancel',
      
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creando sesión de pago:', error);
    res.status(500).json({ error: 'No se pudo crear la sesión de pago' });
  }
};

export default crearDonacion
