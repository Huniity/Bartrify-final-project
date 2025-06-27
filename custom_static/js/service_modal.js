const openBtn = document.getElementById('openBtn');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeBtn');

function openModal() {
  overlay.classList.add('active');
  modal.classList.remove('exiting');
  modal.classList.add('entering');
  overlay.setAttribute('aria-hidden', 'false');
  modal.focus();
}

function closeModal() {
  modal.classList.remove('entering');
  modal.classList.add('exiting');
  overlay.setAttribute('aria-hidden', 'true');
  modal.addEventListener('animationend', () => {
    overlay.classList.remove('active');
    modal.classList.remove('exiting');
  }, {
    once: true
  });
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('active')) {
    closeModal();
  }
});



document.addEventListener("DOMContentLoaded", function() {
  const typeTrade = document.getElementById("type_trade");
  const wrapperService = document.getElementById("wrapper_service");
  const wrapperToken = document.getElementById("wrapper_token");

  function updateDisplay() {
    const value = typeTrade.value;
    const exchangingForServiceSelect = document.getElementById("exchanging_for_service");
    const exchangingForTokenSelect = document.getElementById("exchanging_for_token");

    if (value === "Barter") {
      wrapperService.style.display = "inline-block";
      wrapperToken.style.display = "none";
      exchangingForServiceSelect.setAttribute("required", "required");
      exchangingForTokenSelect.removeAttribute("required");
      exchangingForTokenSelect.value = "";
    } else if (value === "Tokens") {
      wrapperService.style.display = "none";
      wrapperToken.style.display = "block";
      exchangingForTokenSelect.setAttribute("required", "required");
      exchangingForServiceSelect.removeAttribute("required");
      exchangingForServiceSelect.value = "";
    } else {
      wrapperService.style.display = "none";
      wrapperToken.style.display = "none";
      exchangingForServiceSelect.removeAttribute("required");
      exchangingForTokenSelect.removeAttribute("required");
      exchangingForServiceSelect.value = "";
      exchangingForTokenSelect.value = "";
    }
  }

  typeTrade.addEventListener("change", updateDisplay);
  updateDisplay();

  const createServiceForm = document.getElementById('createServiceForm');

  createServiceForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    fetch('/create-service/', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
          'X-Requested-With': 'XMLHttpRequest'
        },
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            showErrorToast("Please Try Agaain");
            throw new Error(errorData.message || 'Something went wrong.');
          });
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          showSuccessToast("Service successfully created!");
          closeModal();
          createServiceForm.reset();

          updateDisplay();
        } else {
          showErrorToast("Please Try Again", data.message);
        }
      })
      .catch(error => {
        showErrorToast("Please Try Again", error.message);
      });
  });

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
});