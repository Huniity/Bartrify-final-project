 const openBtn2    = document.getElementById('openBtn2');
  const overlay2    = document.getElementById('overlay2');
  const modal2      = document.getElementById('modal2');
  const closeBtn2   = document.getElementById('closeBtn2');

  function openModal2() {
    overlay2.classList.add('active');
    modal2.classList.remove('exiting');
    modal2.classList.add('entering');
    overlay2.setAttribute('aria-hidden','false');
    modal2.focus();
  }
  function closeModal2() {
    modal2.classList.remove('entering');
    modal2.classList.add('exiting');
    overlay2.setAttribute('aria-hidden','true');
    modal2.addEventListener('animationend', () => {
      overlay2.classList.remove('active');
      modal2.classList.remove('exiting');
    }, { once: true });
  }

  openBtn2 .addEventListener('click', openModal2);
  closeBtn2.addEventListener('click', closeModal2);
  overlay2.addEventListener('click', e => {
    if (e.target === overlay2) closeModal2();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay2.classList.contains('active')) {
      closeModal2();
    }
  });

  const avatarInput = document.getElementById('avatarInput');
  const avatarPreview = document.getElementById('avatarPreview');

  avatarInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        avatarPreview.src = e.target.result; // update preview image
      };

      reader.readAsDataURL(file);
    }
  });