// Moment Garden configuration
// 1) Works immediately in localStorage mode with no setup.
// 2) To make posts shared across friends, create a Supabase project, run supabase_schema.sql,
//    then fill SUPABASE_URL and SUPABASE_ANON_KEY below.

window.MOMENT_GARDEN_CONFIG = {
  APP_NAME: "Moment Garden",
  TEAM_NAME: "Mali's team",
  // Invite code is currently disabled. Keep this only if you want to re-enable it later.
  INVITE_CODE: "",
  ADMIN_CODE: "GARDEN-ADMIN",
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
  MODERATION_MODE: false,

  // v0.2 asset-ready mode
  // Set ASSET_MODE to false if you want to fall back to the pure CSS/emoji prototype scene.
  ASSET_MODE: true,
  ASSETS: {
    scene: {
      background: "./assets/scenes/cozy-office-placeholder.svg"
    },
    characters: {
      girl: {
        idle: "./assets/characters/mali/idle.svg",
        happy: "./assets/characters/mali/happy.svg",
        shy: "./assets/characters/mali/shy.svg",
        walk: "./assets/characters/mali/walk.svg"
      },
      boy: {
        idle: "./assets/characters/ton/idle.svg",
        happy: "./assets/characters/ton/happy.svg",
        shy: "./assets/characters/ton/shy.svg",
        walk: "./assets/characters/ton/walk.svg"
      }
    }
  },
  SCENE: {
    maxBubbles: 6,
    bubbleSlots: [
      { x: 22, y: 24, size: "medium" },
      { x: 43, y: 22, size: "medium" },
      { x: 72, y: 26, size: "medium" },
      { x: 18, y: 58, size: "medium" },
      { x: 42, y: 73, size: "small" },
      { x: 75, y: 66, size: "large" }
    ]
  },

  CHARACTERS: {
    girl: {
      name: "มะลิ",
      color: "#ff7fa5",
      mood: "ใจฟู",
      note: "มีความสุขจังเลยวันนี้ 😊"
    },
    boy: {
      name: "ต้น",
      color: "#78b7ff",
      mood: "เขินนิดๆ",
      note: "ไม่รู้ทำไมเห็นหน้าแล้วใจเต้นแปลก ๆ 😳"
    }
  }
};
