const openBtn   = document.getElementById('openBtn');
  const overlay   = document.getElementById('overlay');
  const modal     = document.getElementById('modal');
  const closeBtn  = document.getElementById('closeBtn');

  function openModal() {
    overlay.classList.add('active');
    modal.classList.remove('exiting');
    modal.classList.add('entering');
    overlay.setAttribute('aria-hidden','false');
    modal.focus();
  }
  function closeModal() {
    modal.classList.remove('entering');
    modal.classList.add('exiting');
    overlay.setAttribute('aria-hidden','true');
    modal.addEventListener('animationend', () => {
      overlay.classList.remove('active');
      modal.classList.remove('exiting');
    }, { once: true });
  }

  openBtn .addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    const typeTrade = document.getElementById("type_trade");
    const wrapperService = document.getElementById("wrapper_service");
    const wrapperToken = document.getElementById("wrapper_token");
  
    function updateDisplay() {
      const value = typeTrade.value;
      if (value === "Barter") {
        wrapperService.style.display = "inline-block";
        wrapperToken.style.display = "none";
      } else if (value === "Tokens") {
        wrapperService.style.display = "none";
        wrapperToken.style.display = "block";
      } else {
        wrapperService.style.display = "none";
        wrapperToken.style.display = "none";
      }
    }
  
    typeTrade.addEventListener("change", updateDisplay);
    updateDisplay();
  });