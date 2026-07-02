const CONFIG = window.MOMENT_GARDEN_CONFIG || {};
const STORAGE_KEY = "moment-garden-state-v1";
const SESSION_KEY = "moment-garden-session";
const USER_KEY = "moment-garden-user";

function makeId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.makeId();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const REACTIONS = [
  { key: "love", label: "น่ารัก", icon: "💖" },
  { key: "eyes", label: "น่าสงสัย", icon: "👀" },
  { key: "laugh", label: "เขินแทน", icon: "😂" },
  { key: "ship", label: "ship", icon: "🌸" }
];

const TYPE_META = {
  cute: { label: "น่ารัก", icon: "🍪", girlMood: "ใจฟู", boyMood: "ยิ้มเงียบ ๆ" },
  shy: { label: "เขิน", icon: "💗", girlMood: "เขินนิดๆ", boyMood: "ทำตัวไม่ถูก" },
  accident: { label: "บังเอิญ", icon: "☕", girlMood: "แปลกใจ", boyMood: "แกล้งนิ่ง" },
  help: { label: "ช่วยเหลือ", icon: "🪴", girlMood: "อบอุ่นใจ", boyMood: "ภูมิใจเบาๆ" },
  suspicious: { label: "น่าสงสัย", icon: "👀", girlMood: "เริ่มสงสัย", boyMood: "มีพิรุธ" },
  tease: { label: "แอบแซว", icon: "😆", girlMood: "ทำเป็นไม่รู้", boyMood: "หน้าแดง" }
};

const DEFAULT_MOMENTS = [
  {
    id: makeId(),
    text: "เมื่อเช้าเห็นต้นยืนรอมะลิหน้า lift แต่พอมะลิมาถึงก็ทำเป็นกดมือถือ 🥺",
    author: "เพื่อนในทีม",
    anonymous: false,
    type: "shy",
    target: "both",
    reactions: { love: 8, eyes: 5, laugh: 4, ship: 4 },
    reactedBy: {},
    approved: true,
    created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    x: 23,
    y: 26
  },
  {
    id: makeId(),
    text: "วันนี้ต้นเอาขนมไปวางไว้ที่โต๊ะมะลิ แต่บอกว่าเหลือจากประชุม 😊",
    author: "คนเห็นเหตุการณ์",
    anonymous: false,
    type: "cute",
    target: "both",
    reactions: { love: 10, eyes: 2, laugh: 1, ship: 6 },
    reactedBy: {},
    approved: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    x: 47,
    y: 24
  },
  {
    id: makeId(),
    text: "เห็นมะลิช่วยต้นแก้บั๊กจนดึกเลย น่ารักมาก",
    author: "anonymous",
    anonymous: true,
    type: "help",
    target: "both",
    reactions: { love: 7, eyes: 3, laugh: 0, ship: 3 },
    reactedBy: {},
    approved: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    x: 73,
    y: 31
  },
  {
    id: makeId(),
    text: "ประชุมเสร็จ เดินออกมาพร้อมกัน แต่ต่างคนต่างทำเป็นไม่รู้จักกัน 555",
    author: "ทีมแซว",
    anonymous: false,
    type: "tease",
    target: "both",
    reactions: { love: 9, eyes: 4, laugh: 6, ship: 2 },
    reactedBy: {},
    approved: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    x: 17,
    y: 63
  },
  {
    id: makeId(),
    text: "มีคนซื้อกาแฟมา 2 แก้ว แต่บอกว่าเมื่อเช้าเผลอซื้อเกิน 😍",
    author: "สายกาแฟ",
    anonymous: false,
    type: "accident",
    target: "boy",
    reactions: { love: 6, eyes: 4, laugh: 0, ship: 2 },
    reactedBy: {},
    approved: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    x: 43,
    y: 76
  },
  {
    id: makeId(),
    text: "วันนี้ต้นนั่งข้างมะลิทั้งวันเลยรึเปล่านะฮะ?? 😳",
    author: "anonymous",
    anonymous: true,
    type: "suspicious",
    target: "both",
    reactions: { love: 11, eyes: 8, laugh: 1, ship: 6 },
    reactedBy: {},
    approved: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    x: 76,
    y: 69
  }
];

const els = {};
let state = {
  moments: [],
  selectedMomentId: null,
  adminReady: false,
  isSupabase: false
};
let supabaseClient = null;
let realtimeChannel = null;

function $(id) {
  return document.getElementById(id);
}

function initElements() {
  [
    "loginScreen", "appShell", "inviteCode", "loginBtn", "loginError", "appName", "teamName",
    "connectionStatus", "heartFill", "heartPercent", "bigHeart", "unlockText", "bubbleLayer",
    "sparkleLayer", "girlCharacter", "boyCharacter", "girlNameTag", "boyNameTag", "girlMood",
    "boyMood", "girlNote", "boyNote", "timeline", "momentDetail", "detailAuthor", "detailTime",
    "detailType", "detailText", "reactionRow", "likedBy", "closeDetail", "momentForm", "momentText",
    "charCount", "momentType", "momentTarget", "authorName", "anonymous", "shuffleBtn", "clearLocalBtn",
    "viewAllBtn", "allMomentsModal", "closeModal", "allMomentsList", "adminPanel", "adminToggle",
    "adminCode", "adminLoginBtn", "adminLogin", "adminList", "logoutBtn"
  ].forEach((id) => { els[id] = $(id); });
}

function boot() {
  initElements();
  applyConfig();
  bindEvents();

  if (localStorage.getItem(SESSION_KEY) === "ok") {
    showApp();
  } else {
    els.inviteCode.focus();
  }
}

function applyConfig() {
  els.appName.textContent = CONFIG.APP_NAME || "Moment Garden";
  els.teamName.textContent = CONFIG.TEAM_NAME || "Mali's team";

  const girl = CONFIG.CHARACTERS?.girl || {};
  const boy = CONFIG.CHARACTERS?.boy || {};
  els.girlNameTag.textContent = girl.name || "มะลิ";
  els.boyNameTag.textContent = boy.name || "ต้น";
  els.girlMood.textContent = girl.mood || "ใจฟู";
  els.boyMood.textContent = boy.mood || "เขินนิดๆ";
  els.girlNote.textContent = girl.note || "มีความสุขจังเลยวันนี้ 😊";
  els.boyNote.textContent = boy.note || "ไม่รู้ทำไมเห็นหน้าแล้วใจเต้นแปลก ๆ 😳";
}

function bindEvents() {
  els.loginBtn.addEventListener("click", login);
  els.inviteCode.addEventListener("keydown", (event) => {
    if (event.key === "Enter") login();
  });

  els.logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    location.reload();
  });

  document.querySelectorAll(".nav-tab[data-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.remove("active"));
      button.classList.add("active");
      $(button.dataset.jump).scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  els.shuffleBtn.addEventListener("click", () => {
    moveCharactersRandomly();
    sprinkleHearts(18);
  });

  els.clearLocalBtn.addEventListener("click", () => {
    if (state.isSupabase) {
      toast("โหมด Supabase ไม่สามารถล้างข้อมูลจากปุ่ม demo นี้ได้");
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    state.moments = structuredClone(DEFAULT_MOMENTS);
    saveLocalState();
    renderAll();
    toast("ล้างข้อมูล demo และโหลดตัวอย่างใหม่แล้ว 🌸");
  });

  els.closeDetail.addEventListener("click", () => {
    state.selectedMomentId = null;
    renderDetail(null);
    markSelectedBubble();
  });

  els.momentText.addEventListener("input", () => {
    els.charCount.textContent = els.momentText.value.length;
  });

  els.momentForm.addEventListener("submit", submitMoment);
  els.viewAllBtn.addEventListener("click", openAllMoments);
  els.closeModal.addEventListener("click", () => els.allMomentsModal.classList.add("hidden"));
  els.allMomentsModal.addEventListener("click", (event) => {
    if (event.target === els.allMomentsModal) els.allMomentsModal.classList.add("hidden");
  });

  els.adminToggle.addEventListener("click", () => {
    els.adminPanel.classList.toggle("hidden");
    els.adminPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.adminLoginBtn.addEventListener("click", () => {
    if (els.adminCode.value.trim() === (CONFIG.ADMIN_CODE || "GARDEN-ADMIN")) {
      state.adminReady = true;
      els.adminLogin.classList.add("hidden");
      els.adminList.classList.remove("hidden");
      renderAdminList();
      toast("ยินดีต้อนรับ Admin 🌷");
    } else {
      toast("Admin code ไม่ถูกต้อง");
    }
  });
}

async function showApp() {
  els.loginScreen.classList.add("hidden");
  els.appShell.removeAttribute("aria-hidden");
  await initDataSource();
  renderAll();
  setInterval(moveCharactersRandomly, 6500);
  setInterval(() => sprinkleHearts(4), 4800);
}

function login() {
  const code = els.inviteCode.value.trim();
  const expected = CONFIG.INVITE_CODE || "MALI-TON";

  if (code === expected) {
    localStorage.setItem(SESSION_KEY, "ok");
    if (!localStorage.getItem(USER_KEY)) {
      localStorage.setItem(USER_KEY, makeId());
    }
    showApp();
  } else {
    els.loginError.textContent = "รหัสไม่ถูกต้อง ลองเช็ค invite code อีกครั้งนะ";
  }
}

async function initDataSource() {
  const url = CONFIG.SUPABASE_URL;
  const key = CONFIG.SUPABASE_ANON_KEY;

  if (url && key && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(url, key);
      state.isSupabase = true;
      els.connectionStatus.textContent = "โหมดแชร์จริง: เชื่อมต่อ Supabase แล้ว";
      await loadSupabaseMoments();
      subscribeSupabase();
      return;
    } catch (error) {
      console.warn(error);
      toast("เชื่อมต่อ Supabase ไม่สำเร็จ ใช้โหมด demo แทน");
    }
  }

  state.isSupabase = false;
  els.connectionStatus.textContent = "โหมดทดลอง: ข้อมูลเก็บในเครื่องนี้ ถ้าจะให้เพื่อนแชร์ร่วมกันให้ตั้งค่า Supabase";
  loadLocalState();
}

function loadLocalState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.moments = parsed.moments || structuredClone(DEFAULT_MOMENTS);
    } catch (error) {
      state.moments = structuredClone(DEFAULT_MOMENTS);
    }
  } else {
    state.moments = structuredClone(DEFAULT_MOMENTS);
    saveLocalState();
  }
}

function saveLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ moments: state.moments }));
}

async function loadSupabaseMoments() {
  const { data, error } = await supabaseClient
    .from("moments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  state.moments = (data || []).map(normalizeMoment);
  if (state.moments.length === 0) {
    state.moments = structuredClone(DEFAULT_MOMENTS);
    toast("ยังไม่มีข้อมูลใน Supabase แสดงตัวอย่างเริ่มต้นก่อน");
  }
}

function subscribeSupabase() {
  if (!supabaseClient || realtimeChannel) return;
  realtimeChannel = supabaseClient
    .channel("moments-channel")
    .on("postgres_changes", { event: "*", schema: "public", table: "moments" }, async () => {
      await loadSupabaseMoments();
      renderAll();
    })
    .subscribe();
}

function normalizeMoment(row) {
  return {
    id: row.id,
    text: row.text,
    author: row.author || "anonymous",
    anonymous: Boolean(row.anonymous),
    type: row.type || "cute",
    target: row.target || "both",
    reactions: row.reactions || { love: 0, eyes: 0, laugh: 0, ship: 0 },
    reactedBy: row.reacted_by || {},
    approved: row.approved !== false,
    created_at: row.created_at || new Date().toISOString(),
    x: row.x || randomBetween(16, 80),
    y: row.y || randomBetween(20, 78)
  };
}

function renderAll() {
  const approved = getApprovedMoments();
  if (!state.selectedMomentId && approved.length) state.selectedMomentId = approved[0].id;
  renderBubbles();
  renderTimeline();
  renderHeart();
  renderDetail(getSelectedMoment());
  renderMoods();
  renderAdminList();
}

function getApprovedMoments() {
  return state.moments
    .filter((moment) => moment.approved)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function getSelectedMoment() {
  return state.moments.find((moment) => moment.id === state.selectedMomentId) || getApprovedMoments()[0] || null;
}

function renderBubbles() {
  const approved = getApprovedMoments();
  els.bubbleLayer.innerHTML = "";

  approved.slice(0, 8).forEach((moment, index) => {
    const bubble = document.createElement("button");
    bubble.className = `moment-bubble ${moment.type}`;
    bubble.dataset.id = moment.id;
    bubble.style.left = `${moment.x || 25 + index * 8}%`;
    bubble.style.top = `${moment.y || 25 + index * 6}%`;
    bubble.style.animationDelay = `${index * -0.45}s`;

    const total = totalReactions(moment);
    bubble.innerHTML = `
      <span class="bubble-pin">${TYPE_META[moment.type]?.icon || "💗"}</span>
      <div class="bubble-text">${escapeHtml(moment.text)}</div>
      <div class="bubble-meta">
        <span>👀 ${moment.reactions.eyes || 0}</span>
        <span>💖 ${moment.reactions.love || 0}</span>
        <span>🌸 ${moment.reactions.ship || 0}</span>
        <span>${total ? total : "ใหม่"}</span>
      </div>
    `;

    bubble.addEventListener("click", () => {
      state.selectedMomentId = moment.id;
      renderDetail(moment);
      markSelectedBubble();
      moveCharactersForMoment(moment);
      sprinkleHearts(12);
    });

    els.bubbleLayer.appendChild(bubble);
  });

  markSelectedBubble();
}

function markSelectedBubble() {
  document.querySelectorAll(".moment-bubble").forEach((bubble) => {
    bubble.classList.toggle("selected", bubble.dataset.id === state.selectedMomentId);
  });
}

function renderDetail(moment) {
  if (!moment) {
    els.detailAuthor.textContent = "เพื่อนในทีม";
    els.detailTime.textContent = "ยังไม่มีโมเมนต์";
    els.detailType.textContent = "เริ่มเรื่อง";
    els.detailText.textContent = "ลองแชร์โมเมนต์แรกของทีมดูนะ";
    els.reactionRow.innerHTML = "";
    els.likedBy.textContent = "";
    return;
  }

  els.detailAuthor.textContent = moment.anonymous ? "anonymous" : moment.author || "เพื่อนในทีม";
  els.detailTime.textContent = timeAgo(moment.created_at);
  els.detailType.textContent = TYPE_META[moment.type]?.label || "โมเมนต์";
  els.detailText.textContent = moment.text;

  els.reactionRow.innerHTML = "";
  const userId = getUserId();
  REACTIONS.forEach((reaction) => {
    const button = document.createElement("button");
    const reacted = Boolean(moment.reactedBy?.[userId]?.includes(reaction.key));
    button.className = `reaction-btn ${reacted ? "active" : ""}`;
    button.textContent = `${reaction.icon} ${reaction.label} ${moment.reactions?.[reaction.key] || 0}`;
    button.addEventListener("click", () => toggleReaction(moment.id, reaction.key));
    els.reactionRow.appendChild(button);
  });

  els.likedBy.textContent = `${Math.max(totalReactions(moment), 0)} reaction แล้ว`;
}

function renderTimeline() {
  const approved = getApprovedMoments().slice(0, 5).reverse();
  els.timeline.innerHTML = "";

  approved.forEach((moment, index) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <div class="timeline-icon">${TYPE_META[moment.type]?.icon || "💌"}</div>
      <small>Day ${index + 1}</small>
      <p>${escapeHtml(shortText(moment.text, 28))}</p>
    `;
    els.timeline.appendChild(item);
  });

  if (approved.length < 5) {
    const locked = document.createElement("div");
    locked.className = "timeline-item";
    locked.innerHTML = `
      <div class="timeline-icon">?</div>
      <small>???</small>
      <p>ถัดไปจะเกิดอะไรนะ?</p>
    `;
    els.timeline.appendChild(locked);
  }
}

function renderHeart() {
  const percent = calculateHeart();
  els.heartFill.style.width = `${percent}%`;
  els.heartPercent.textContent = `${percent}%`;
  els.bigHeart.textContent = `${percent}%`;

  if (percent >= 100) {
    els.unlockText.textContent = "ปลดล็อกซีนพิเศษแล้ว! จัด mini event ได้เลย 💌";
  } else if (percent >= 75) {
    els.unlockText.textContent = `อีก ${100 - percent}% จะปลดล็อกซีนพิเศษ 💕`;
  } else {
    els.unlockText.textContent = `อีก ${75 - percent}% จะปลดล็อก scene แอบคุยกันหลังประชุม 🌷`;
  }
}

function renderMoods() {
  const latest = getApprovedMoments()[0];
  const girl = CONFIG.CHARACTERS?.girl || {};
  const boy = CONFIG.CHARACTERS?.boy || {};

  if (!latest) {
    els.girlMood.textContent = girl.mood || "ใจฟู";
    els.boyMood.textContent = boy.mood || "เขินนิดๆ";
    return;
  }

  const meta = TYPE_META[latest.type] || TYPE_META.cute;
  els.girlMood.textContent = meta.girlMood;
  els.boyMood.textContent = meta.boyMood;
  els.girlNote.textContent = latest.target === "boy" ? "เหมือนวันนี้มีอะไรบางอย่างนะ 👀" : "วันนี้มีเรื่องให้อมยิ้มอีกแล้ว 😊";
  els.boyNote.textContent = latest.target === "girl" ? "พยายามทำตัวปกติที่สุดแล้ว 😳" : "ยิ่งถูกแซวยิ่งทำตัวไม่ถูก";
}

function renderAdminList() {
  if (!state.adminReady || !els.adminList) return;
  els.adminList.innerHTML = "";

  state.moments
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .forEach((moment) => {
      const item = document.createElement("div");
      item.className = "admin-item";
      item.innerHTML = `
        <p>${escapeHtml(moment.text)}</p>
        <small>${moment.approved ? "แสดงอยู่" : "รอ approve"} · ${timeAgo(moment.created_at)}</small>
        <div class="admin-actions">
          ${!moment.approved ? `<button data-action="approve" data-id="${moment.id}">Approve</button>` : ""}
          <button data-action="delete" data-id="${moment.id}">ลบ</button>
        </div>
      `;
      els.adminList.appendChild(item);
    });

  els.adminList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      const action = button.dataset.action;
      if (action === "approve") await approveMoment(id);
      if (action === "delete") await deleteMoment(id);
    });
  });
}

async function submitMoment(event) {
  event.preventDefault();
  const text = els.momentText.value.trim();
  if (!text) return;

  const moment = {
    id: makeId(),
    text,
    author: els.anonymous.checked ? "anonymous" : (els.authorName.value.trim() || "เพื่อนในทีม"),
    anonymous: els.anonymous.checked,
    type: els.momentType.value,
    target: els.momentTarget.value,
    reactions: { love: 0, eyes: 0, laugh: 0, ship: 0 },
    reactedBy: {},
    approved: CONFIG.MODERATION_MODE ? false : true,
    created_at: new Date().toISOString(),
    x: randomBetween(18, 78),
    y: randomBetween(20, 78)
  };

  try {
    if (state.isSupabase) {
      const { error } = await supabaseClient.from("moments").insert(toSupabaseRow(moment));
      if (error) throw error;
      if (!CONFIG.MODERATION_MODE) state.moments.unshift(moment);
    } else {
      state.moments.unshift(moment);
      saveLocalState();
    }

    els.momentForm.reset();
    els.charCount.textContent = "0";
    state.selectedMomentId = moment.approved ? moment.id : state.selectedMomentId;
    renderAll();
    moveCharactersForMoment(moment);
    sprinkleHearts(24);
    toast(CONFIG.MODERATION_MODE ? "ส่งแล้ว รอ admin approve ก่อนแสดงผลนะ 💌" : "โมเมนต์ลอยขึ้นในสวนแล้ว 💌");
  } catch (error) {
    console.error(error);
    toast("ส่งโมเมนต์ไม่สำเร็จ ลองเช็คการตั้งค่า Supabase");
  }
}

function toSupabaseRow(moment) {
  return {
    id: moment.id,
    text: moment.text,
    author: moment.author,
    anonymous: moment.anonymous,
    type: moment.type,
    target: moment.target,
    reactions: moment.reactions,
    reacted_by: moment.reactedBy,
    approved: moment.approved,
    x: moment.x,
    y: moment.y
  };
}

async function toggleReaction(momentId, reactionKey) {
  const moment = state.moments.find((item) => item.id === momentId);
  if (!moment) return;

  const userId = getUserId();
  moment.reactions = moment.reactions || { love: 0, eyes: 0, laugh: 0, ship: 0 };
  moment.reactedBy = moment.reactedBy || {};
  moment.reactedBy[userId] = moment.reactedBy[userId] || [];

  const index = moment.reactedBy[userId].indexOf(reactionKey);
  if (index >= 0) {
    moment.reactedBy[userId].splice(index, 1);
    moment.reactions[reactionKey] = Math.max((moment.reactions[reactionKey] || 1) - 1, 0);
  } else {
    moment.reactedBy[userId].push(reactionKey);
    moment.reactions[reactionKey] = (moment.reactions[reactionKey] || 0) + 1;
    sprinkleHearts(10);
  }

  try {
    if (state.isSupabase) {
      const { error } = await supabaseClient
        .from("moments")
        .update({ reactions: moment.reactions, reacted_by: moment.reactedBy })
        .eq("id", moment.id);
      if (error) throw error;
    } else {
      saveLocalState();
    }
    renderAll();
  } catch (error) {
    console.error(error);
    toast("อัพเดท reaction ไม่สำเร็จ");
  }
}

async function approveMoment(id) {
  const moment = state.moments.find((item) => item.id === id);
  if (!moment) return;
  moment.approved = true;

  if (state.isSupabase) {
    const { error } = await supabaseClient.from("moments").update({ approved: true }).eq("id", id);
    if (error) return toast("Approve ไม่สำเร็จ");
  } else {
    saveLocalState();
  }
  renderAll();
  toast("Approve แล้ว 🌷");
}

async function deleteMoment(id) {
  const ok = confirm("ลบโมเมนต์นี้ใช่ไหม?");
  if (!ok) return;

  if (state.isSupabase) {
    const { error } = await supabaseClient.from("moments").delete().eq("id", id);
    if (error) return toast("ลบไม่สำเร็จ");
  }

  state.moments = state.moments.filter((item) => item.id !== id);
  if (!state.isSupabase) saveLocalState();
  if (state.selectedMomentId === id) state.selectedMomentId = null;
  renderAll();
  toast("ลบแล้ว");
}

function openAllMoments() {
  els.allMomentsList.innerHTML = "";
  getApprovedMoments().forEach((moment) => {
    const card = document.createElement("div");
    card.className = "all-moment-card";
    card.innerHTML = `
      <strong>${TYPE_META[moment.type]?.icon || "💌"} ${TYPE_META[moment.type]?.label || "โมเมนต์"} · ${timeAgo(moment.created_at)}</strong>
      <p>${escapeHtml(moment.text)}</p>
    `;
    els.allMomentsList.appendChild(card);
  });
  els.allMomentsModal.classList.remove("hidden");
}

function moveCharactersForMoment(moment) {
  const positions = {
    both: [{ x: 42, y: 63 }, { x: 56, y: 62 }],
    girl: [{ x: 38, y: 58 }, { x: 64, y: 68 }],
    boy: [{ x: 36, y: 68 }, { x: 62, y: 57 }]
  };
  const [girl, boy] = positions[moment.target] || positions.both;
  setCharacterPosition(els.girlCharacter, girl.x, girl.y);
  setCharacterPosition(els.boyCharacter, boy.x, boy.y);
}

function moveCharactersRandomly() {
  setCharacterPosition(els.girlCharacter, randomBetween(30, 50), randomBetween(54, 75));
  setCharacterPosition(els.boyCharacter, randomBetween(50, 70), randomBetween(50, 74));
}

function setCharacterPosition(el, x, y) {
  el.classList.add("walking");
  el.style.setProperty("--x", `${x}%`);
  el.style.setProperty("--y", `${y}%`);
  window.setTimeout(() => el.classList.remove("walking"), 1350);
}

function sprinkleHearts(count = 8) {
  const icons = ["💗", "✨", "🌸", "💕", "♡"];
  for (let i = 0; i < count; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.textContent = icons[Math.floor(Math.random() * icons.length)];
    sparkle.style.left = `${randomBetween(18, 78)}%`;
    sparkle.style.top = `${randomBetween(42, 76)}%`;
    sparkle.style.animationDelay = `${Math.random() * 0.7}s`;
    els.sparkleLayer.appendChild(sparkle);
    window.setTimeout(() => sparkle.remove(), 3200);
  }
}

function calculateHeart() {
  const moments = getApprovedMoments();
  const reactionScore = moments.reduce((sum, moment) => sum + totalReactions(moment), 0);
  const momentScore = moments.length * 5;
  return Math.min(100, Math.round(18 + momentScore + reactionScore * 0.9));
}

function totalReactions(moment) {
  return Object.values(moment.reactions || {}).reduce((sum, count) => sum + Number(count || 0), 0);
}

function getUserId() {
  let userId = localStorage.getItem(USER_KEY);
  if (!userId) {
    userId = makeId();
    localStorage.setItem(USER_KEY, userId);
  }
  return userId;
}

function randomBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function shortText(text, limit = 38) {
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "เมื่อสักครู่";
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  const days = Math.floor(hours / 24);
  return `${days} วันที่แล้ว`;
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 2800);
}

window.addEventListener("DOMContentLoaded", boot);
