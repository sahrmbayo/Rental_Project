// components/CheckoutButton.tsx
export default function CheckoutButton() {
  const startCheckout = async () => {
    const payload = {
      name: 'Order #1002',
      orderId: 'ord_1002',
      lineItems: [
        {
          type: 'custom',
          name: 'For Rental',
          price: { currency: 'SLE', value: 2 * 100 }, // toMinorUnits(25)
          quantity: 1,
        },
      ],
      metadata: { cartId: 'cart_123' },
      callbackState: 'state_cart_123',
    }

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      console.log('Response:', res)
      if (!res.ok) throw new Error(await res.text())

      const { redirectUrl } = await res.json()
      if (redirectUrl) window.location.href = redirectUrl
    } catch (err) {
      console.error(err)
      alert('Checkout failed')
    }
  }

  return (
    <button
      onClick={startCheckout}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Pay with Stripe
    </button>
  )
}