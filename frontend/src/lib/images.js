// Centralized asset URLs — swap at will.
// Rule: USER-PROVIDED images are never replaced; only stock fallbacks get swapped in.
export const IMAGES = {
  // === BRAND ASSETS (user-provided) ===
  logo:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/osa3czix_Muk%20Buddy%20Logo.png",
  logoText:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/i3n3whj9_muk_buddy_textonly.png",
  heroComposite:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/ai7m3ptx_gx4EB43hTDqcrh7-VK5-n_wum4bLZ2.png",
  spokesperson:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/ateqxovx_AngieMukBuddy.png",
  // Newer spokesperson shot — Angie holding the bag (yellow top, looking at camera)
  spokespersonAngie02:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/e13k6dqk_angie_02.png",
  // Background video — contractor vacuuming a floor (Kling-generated, ~12 MB)
  contractorVacVideo:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/g4y2gs68_Kling%2030%20Pro%20-%20contractor%20is%20vacuuming%20the%20floor.mp4",
  productShot:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/dq01bb5d_Product%20Shot.png",
  productShotBox:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/ydis8ste_Product%20Shot.png",
  // Headline peek-in variants (transparent PNGs of the Muk Buddy product)
  productStraight:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/vwt7hg78_MukBuddyproduct2.png",
  productTilted1:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/q7nti1r1_MukBuddyTilted1.png",
  productTilted2:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/hghh14sa_MukBuddyTilted2a.png",
  bagPileMountain:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/4277znce_generated-image%20%2818%29.png",
  disposableBagsFan:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/me3cldqe_image.png",
  disposableBagYellow:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/l5bbe381_image.png",
  contractorVac:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/r61bro8a_generated-image%20%2816%29.png",
  contractorBag:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/w9xec8bp_ChatGPT%20Image%20Apr%2023%2C%202026%2C%2009_50_47%20AM.png",
  messyJobsite1:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/artehkve_rG9W0_LOMloE0ETffKBEC_NKsgEj17.png",
  messyJobsite2:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/kd9yw6ds_DK-bg-Ynwa-0U6hvMcal9_Xq9oD6fj.png",
  mascotAnimation:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/oyaig8os_Muk_Buddy_Animation_gif_v2.webm",
  productVideo:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/oyaig8os_Muk_Buddy_Animation_gif_v2.webm",

  // === SECTION SLOTS — point to user-provided where possible, stock as fallback ===

  // Hero bg (not actively used; Hero uses halftone+gradients)
  heroBg:
    "https://images.unsplash.com/photo-1690983320828-c01b88baacb0?crop=entropy&cs=srgb&fm=jpg&w=2400&q=70",

  // Problem — Disposable Bags card (USER PHOTO)
  problemBags:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/w9xec8bp_ChatGPT%20Image%20Apr%2023%2C%202026%2C%2009_50_47%20AM.png",
  // Problem — Bag-less card (USER PHOTO — Carhartt contractor disgusted by dust-caked filter)
  problemBagless:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/3j9slz29_HJ50xxRDRhX_s6gPAaW0O_2v69uZBX.png",
  // Alt: contractor smiling, holding vac open with clogged filter inside
  dirtyFilterAlt:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/8d796pub_tJBwXjtJYkt4E5VEQ402d_cxF6tjyA.png",

  // Airflow bg (no longer rendered in Airflow.jsx; kept for safety)
  airflowBg:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=2000&q=70",

  // Difference / In The Field card (USER PHOTO — vest contractor with shop-vac)
  difference:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/r61bro8a_generated-image%20%2816%29.png",

  // Benefits — wide crew banner (USER PHOTO — vest contractor in the field)
  benefitsBanner:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/r61bro8a_generated-image%20%2816%29.png",

  // Dry performance — drywall / fine dust (USER PHOTO — vest contractor in demolished drywall room)
  dry:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/kd9yw6ds_DK-bg-Ynwa-0U6hvMcal9_Xq9oD6fj.png",

  // Wet performance (USER PHOTO — contractor squeegeeing wet floor in demoed room with shop-vac)
  wet: "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/9jy241z6_mukbuddy%20wet%20dry%20vac.png",

  // Waste / "Today's mess" card (USER PHOTO — jacket contractor at messy floor reused)
  waste:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/artehkve_rG9W0_LOMloE0ETffKBEC_NKsgEj17.png",

  // Testimonial portraits (USER PHOTOS)
  portrait1:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/5ozdyih6_siding%20contractor%20testimonial%202.png",
  portrait2:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/lqckq2qo_contractor%20testimonial%201.png",
  portrait3:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/7kfllotw_ChatGPT%20Image%20May%208%2C%202026%2C%2003_58_47%20PM.png",
  portrait4:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/qlw07r5c_Contractor%20Testimonial%204.png",

  // Final CTA bg (mostly hidden behind purple halftone overlay; kept stock for now)
  finalCta:
    "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=2000",

  // Bagless Lie section — generated illustration (clogged filter + smoking motor)
  baglessDisaster: "/bagless-disaster.png",

  // 2-Chamber visual (legacy; TwoChamber section now plays mascotAnimation)
  twoChamberDiagram:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/nn8s1cjy_Product%20Shot2.png",
};
