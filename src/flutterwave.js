const FLUTTERWAVE_SCRIPT_URL = 'https://checkout.flutterwave.com/v3.js';

export function loadFlutterwaveCheckout() {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  if (window.FlutterwaveCheckout) {
    return Promise.resolve(true);
  }

  const existingScript = document.querySelector(`script[src="${FLUTTERWAVE_SCRIPT_URL}"]`);
  if (existingScript) {
    return new Promise((resolve) => {
      if (existingScript.dataset.loaded === 'true') {
        resolve(true);
        return;
      }

      existingScript.addEventListener('load', () => {
        existingScript.dataset.loaded = 'true';
        resolve(true);
      }, { once: true });

      existingScript.addEventListener('error', () => {
        resolve(false);
      }, { once: true });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = FLUTTERWAVE_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve(true);
    };
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openFlutterwaveCheckout({ publicKey, subaccountId, request, onSuccess, onClose, onError }) {
  const loaded = await loadFlutterwaveCheckout();
  if (!loaded || typeof window.FlutterwaveCheckout !== 'function') {
    onError?.('Flutterwave checkout could not be loaded. Please verify your public key and network access.');
    return;
  }

  const amount = Number(request.amount || 1000);
  const details = request.details || {};
  const customerName = details.applicantName || details.firstName || details.surname || 'Customer';
  const customerEmail = details.email || 'customer@example.com';
  const phoneNumber = details.phone || details.gsm || '';

  const config = {
    public_key: publicKey,
    tx_ref: `nin-${request.id}-${Date.now()}`,
    amount,
    currency: 'NGN',
    payment_options: 'card,banktransfer,ussd',
    customer: {
      email: customerEmail,
      phone_number: phoneNumber,
      name: customerName,
    },
    customizations: {
      title: 'NIN Verification Payment',
      description: request.service || 'NIN verification service',
    },
    meta: {
      requestId: request.id,
      service: request.service,
      flow: 'manual_remittance_wire',
      subaccountId: subaccountId || '',
    },
    callback: (response) => {
      onSuccess?.(response);
    },
    onclose: () => {
      onClose?.();
    },
  };

  if (subaccountId) {
    config.subaccounts = [{ id: subaccountId }];
  }

  window.FlutterwaveCheckout(config);
}
