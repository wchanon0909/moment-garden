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
