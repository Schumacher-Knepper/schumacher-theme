document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('AgeVerificationModal');
  if (!modal) return;

  const form = document.getElementById('AgeVerificationForm');
  const errorMsg = document.getElementById('AgeVerificationError');
  const cancelBtn = document.getElementById('AgeVerificationCancel');
  
  const minAge = parseInt(modal.getAttribute('data-min-age')) || 18;
  
  let interceptedForm = null;
  let interceptedButton = null;

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  }

  function showModal(targetForm) {
    interceptedForm = targetForm;
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    // Lock body scroll
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    interceptedForm = null;
    form.reset();
    errorMsg.classList.add('hidden');
  }

  function calculateAge(year, month, day) {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Intercept all add to cart form submissions
  document.addEventListener('submit', function(event) {
    const targetForm = event.target;
    
    // Check if it's an add to cart form (accounting for localized sub-paths like /fr/cart/add)
    if (targetForm.action.includes('/cart/add')) {
      // If we already verified during this session, let it pass
      if (targetForm.dataset.ageVerified === 'true') return;

      const isAdult = getCookie('isAdult');
      
      if (!isAdult) {
        // Prevent submission and show modal
        event.preventDefault();
        event.stopImmediatePropagation();
        
        // Store the button that was clicked to future-proof the re-trigger
        interceptedButton = event.submitter || targetForm.querySelector('[type="submit"]');
        
        // Show the modal
        showModal(targetForm);
      }
    }
  }, true); // useCapture = true to intercept before theme scripts

  // Intercept "Buy it now" (dynamic checkout) buttons
  document.addEventListener('click', function(event) {
    const target = event.target.closest('.shopify-payment-button__button');
    if (target) {
      const targetForm = target.closest('form');
      if (targetForm && targetForm.dataset.ageVerified !== 'true' && !getCookie('isAdult')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        interceptedButton = target;
        showModal(targetForm);
      }
    }
  }, true);

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const day = parseInt(form.elements['day'].value);
    const month = parseInt(form.elements['month'].value);
    const year = parseInt(form.elements['year'].value);
    
    // Basic date validation
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      errorMsg.textContent = "Please enter a valid date.";
      errorMsg.classList.remove('hidden');
      return;
    }

    const age = calculateAge(year, month, day);

    if (age >= minAge) {
      // Success
      errorMsg.classList.add('hidden');
      setCookie('isAdult', 'true', 30); // Expires in 30 days
      
      if (interceptedForm) {
        // Format dates for attributes
        const formattedDOB = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const timestamp = new Date().toISOString();

        // Inject hidden inputs into the original form to pass attributes
        const appendHiddenInput = (name, value) => {
          let input = interceptedForm.querySelector(`input[name="${name}"]`);
          if (!input) {
            input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            interceptedForm.appendChild(input);
          }
          input.value = value;
        };

        appendHiddenInput('attributes[Age_Verified]', 'true');
        appendHiddenInput('attributes[DOB_Entered]', formattedDOB);
        appendHiddenInput('attributes[Verification_Timestamp]', timestamp);

        // Mark form as verified so our interceptors ignore it
        interceptedForm.dataset.ageVerified = 'true';
        
        hideModal();
        
        // Check if there is a specific button we intercepted (like Buy it now)
        if (interceptedButton) {
          interceptedButton.click();
          interceptedButton = null;
        } else {
          interceptedForm.dispatchEvent(new Event('submit', {
            bubbles: true,
            cancelable: true
          }));
        }
      } else {
        hideModal();
      }
    } else {
      // Failed
      errorMsg.textContent = modal.getAttribute('data-error-message') || "You must be of legal drinking age to purchase.";
      errorMsg.classList.remove('hidden');
    }
  });

  cancelBtn.addEventListener('click', () => {
    hideModal();
    // Optional: redirect to a safe page like Google if they click disagree?
    // window.location.href = "https://www.google.com";
  });
});
