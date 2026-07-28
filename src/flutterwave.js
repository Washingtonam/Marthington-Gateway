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
      console.debug('[flutterwave] checkout script loaded:', FLUTTERWAVE_SCRIPT_URL);
      resolve(true);
    };
    script.onerror = (event) => {
      console.error('[flutterwave] failed to load checkout script', FLUTTERWAVE_SCRIPT_URL, event);
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function openFlutterwaveCheckout({ publicKey, subaccountId, request, onSuccess, onClose, onError }) {
  const loaded = await loadFlutterwaveCheckout();
  if (!loaded) {
    onError?.('Flutterwave checkout script failed to load. Check browser network access and ensure https://checkout.flutterwave.com/v3.js is reachable.');
    return;
  }

  if (typeof window.FlutterwaveCheckout !== 'function') {
    console.error('[flutterwave] FlutterwaveCheckout object missing after script load', window.FlutterwaveCheckout);
    onError?.('Flutterwave checkout script loaded but the checkout object is unavailable. This may be due to a blocked browser extension or an invalid script response.');
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
