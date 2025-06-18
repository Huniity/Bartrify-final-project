const editPopupBtn         = document.getElementById('editPopupBtn');
const editPopupOverlay     = document.getElementById('editPopupOverlay');
const editPopupModal       = document.getElementById('editPopupModal');
const closeBtn3            = document.getElementById('closeBtn3');
const cancelBtn            = document.getElementById('editPopupCancelBtn');
const editPopupTextarea    = document.getElementById('editPopupTextarea');
const editPopupSaveBtn     = document.getElementById('editPopupSaveBtn');
const editableText         = document.getElementById('editableText');

// Open modal
function openEditModal() {
  editPopupTextarea.value = editableText.textContent.trim();
  editPopupOverlay.classList.add('active');
  editPopupModal.classList.remove('exiting');
  editPopupModal.classList.add('entering');
  editPopupOverlay.setAttribute('aria-hidden', 'false');
  editPopupTextarea.focus();
}

// Close modal
function closeEditModal() {
  editPopupModal.classList.remove('entering');
  editPopupModal.classList.add('exiting');
  editPopupOverlay.setAttribute('aria-hidden', 'true');
  editPopupModal.addEventListener('animationend', () => {
    editPopupOverlay.classList.remove('active');
    editPopupModal.classList.remove('exiting');
  }, { once: true });
}

// Save changes
function saveEdit() {
  editableText.textContent = editPopupTextarea.value;
  closeEditModal();
}

// Event listeners
editPopupBtn.addEventListener('click', openEditModal);
closeBtn3.addEventListener('click', closeEditModal);
cancelBtn.addEventListener('click', closeEditModal);
editPopupOverlay.addEventListener('click', e => {
  if (e.target === editPopupOverlay) closeEditModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && editPopupOverlay.classList.contains('active')) {
    closeEditModal();
  }
});
editPopupSaveBtn.addEventListener('click', saveEdit);
