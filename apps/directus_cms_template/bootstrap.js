import axios from "axios";
import { spawn } from "child_process";

const url = process.env.DIRECTUS_URL || "http://directus:8055";
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

async function waitForDirectus() {
  let ready = false;
  while (!ready) {
    try {
      await axios.get(url + "/server/health");
      ready = true;
    } catch (err) {
      console.log("⏳ Waiting for Directus...");
      console.log("Trying to connect to:", url);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

async function main() {
  await waitForDirectus();

  // login
  console.log("🔑 Logging in to Directus...");
  const res = await axios.post(url + "/auth/login", {
    email,
    password,
  });

  const token = res.data.data.access_token;
  console.log("✅ Got token:", token.substring(0, 10) + "...");

  // apply CMS template
  console.log("📦 Applying CMS template...");
  try {
    // ตรวจสอบ collection ก่อนถ้ามีทั้งหมดแล้วไม่ต้องทำอะไร
    const schemaNames = [
      "ai_prompts",
      "block_button",
      "block_button_group",
      "block_form",
      "block_gallery",
      "block_gallery_items",
      "block_hero",
      "block_posts",
      "block_pricing",
      "block_pricing_cards",
      "block_richtext",
      "form_fields",
      "form_submission_values",
      "form_submissions",
      "forms",
      "globals",
      "navigation",
      "navigation_items",
      "page_blocks",
      "pages",
      "posts",
      "redirects",
      "directus_settings",
      "directus_users",
    ]
    let collectionCompleted = true;
    for (const name of schemaNames) {
      const checkCollection = await axios.get(url + "/items/" + name, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (checkCollection.data.data.length == 0) {
        collectionCompleted = false;
        return;
      }
    }
    if(!collectionCompleted) {
      // ใช้ spawn แทน execSync เพื่อให้ควบคุม timeout ได้ดีขึ้น
      const child = spawn('npx', [
        'directus-template-cli', 
        'apply',
        '-p', // programmatic mode (non-interactive)
        '--templateType', 
        'community',
        '--templateLocation',
        'CMS', // template name ที่เราต้องการ
        '--directusUrl', 
        url,
        '--directusToken', 
        token,
        '--disableTelemetry' // ปิด telemetry
      ], {
        stdio: 'inherit',
        timeout: 120000 // เพิ่ม timeout เป็น 2 นาที
      });

      console.log("⏳ Installing CMS template... This may take a while...");

      // รอให้ process เสร็จสิ้น
      await new Promise((resolve, reject) => {
        child.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`directus-template-cli exited with code ${code}`));
          }
        });

        child.on('error', (err) => {
          reject(err);
        });

        // timeout protection - เพิ่มเวลาเป็น 2 นาที
        setTimeout(() => {
          child.kill('SIGTERM');
          reject(new Error('Template application timed out after 2 minutes'));
        }, 120000);
      });
    } else {
      console.log("📦 CMS template already applied.");
    }
    

  } catch (error) {
    console.error("❌ Error applying template:", error.message);
    console.log("⚠️  Continuing without template - Directus is still functional");
    console.log("💡 You can manually apply templates via Directus admin interface");
    // ไม่ให้ exit เพื่อให้ Directus ทำงานต่อไปได้
    return;
  }

  console.log("🎉 CMS template applied successfully!");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
