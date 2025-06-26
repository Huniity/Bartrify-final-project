document.addEventListener('DOMContentLoaded', function () {
  const ctx = document.getElementById('servicesChart').getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 180);
  gradient.addColorStop(0, '#f87d6f');
  gradient.addColorStop(1, '#2d3748');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Services Completed',
        data: [8, 12, 15, 14, 18, 22],
        backgroundColor: gradient,
        borderColor: '#cb6089',
        borderWidth: 1,
        borderRadius: 6,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: { stepSize: 5, font: { size: 9 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 9 } }
        }
      }
    }
  });
  const tabBtn = document.querySelectorAll('.tab-btn');
  const tabPanel = document.querySelectorAll('.tab-pane');

  tabBtn.forEach(button => {
    button.addEventListener('click', function () {
      const tabId = this.getAttribute('data-tab');

      tabBtn.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      tabPanel.forEach(pane => pane.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });
  const el = document.getElementById('scrollable');
  if (el) el.scrollTop = el.scrollHeight;

  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("room_id");
  if (roomId) {
    const roomElem = document.getElementById(`room-${roomId}`);
    if (roomElem) roomElem.click();
  } else {
    const firstRoom = document.querySelector('#roomList .chat-button');
    if (firstRoom) firstRoom.click();
  }
});