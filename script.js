document.getElementById("year").textContent = new Date().getFullYear();

const avatars = [
  "assets/avatar1.png",
  "assets/avatar2.png"
];
const avatarEl = document.getElementById("avatar");
if (avatarEl) {
  avatarEl.src = avatars[Math.floor(Math.random() * avatars.length)];
}

const glow = document.querySelector(".bg-glow");
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(124,92,255,0.15), transparent 55%)`;
});

const DISCORD_ID = "ТВОЙ_ID_СЮДА";
async function updateDiscordStatus() {
  const el = document.getElementById("discord-status");
  const dot = document.getElementById("status-dot");
  const text = document.getElementById("discord-text");
  if (!el || !dot || !text) return;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    const json = await res.json();
    if (!json.success) throw new Error("no data");

    const data = json.data;
    const status = data.discord_status;
    dot.className = `status-dot ${status}`;

    const activity = data.activities.find(a => a.type !== 4);
    if (activity) {
      let line = activity.name;
      if (activity.details) line += ` — ${activity.details}`;
      if (activity.state) line += ` (${activity.state})`;
      text.textContent = line;
    } else {
      const statusMap = {
        online: "в сети",
        idle: "не активен",
        dnd: "не беспокоить",
        offline: "не в сети"
      };
      text.textContent = `Discord: ${statusMap[status] || status}`;
    }

    el.classList.add("visible");
  } catch (e) {
    el.classList.remove("visible");
  }
}

updateDiscordStatus();
setInterval(updateDiscordStatus, 30000);
