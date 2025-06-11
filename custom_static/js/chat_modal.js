const openBtn3  = document.getElementById('openBtn3');
    const overlay3  = document.getElementById('overlay3');
    const modal3    = document.getElementById('modal3');
    const closeBtn3 = document.getElementById('closeBtn3');

    function openModal3() {
      overlay3.classList.add('active');
      // allow repaint then slide in
      requestAnimationFrame(() => modal3.classList.add('open'));
      overlay3.setAttribute('aria-hidden', 'false');
    }

    function closeModal3() {
      modal3.classList.remove('open');
      // wait for transition then hide overlay
      modal3.addEventListener('transitionend', () => {
        overlay3.classList.remove('active');
        overlay3.setAttribute('aria-hidden', 'true');
      }, { once: true });
    }

    openBtn3.addEventListener('click', openModal3);
    closeBtn3.addEventListener('click', closeModal3);
    overlay3.addEventListener('click', e => {
      if (e.target === overlay3) closeModal3();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay3.classList.contains('active')) {
        closeModal3();
      }
    });