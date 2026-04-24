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
  productShot:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/nn8s1cjy_Product%20Shot2.png",
  productShotBox:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/ydis8ste_Product%20Shot.png",
  contractorVac:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/r61bro8a_generated-image%20%2816%29.png",
  contractorBag:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/w9xec8bp_ChatGPT%20Image%20Apr%2023%2C%202026%2C%2009_50_47%20AM.png",
  messyJobsite1:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/artehkve_rG9W0_LOMloE0ETffKBEC_NKsgEj17.png",
  messyJobsite2:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/kd9yw6ds_DK-bg-Ynwa-0U6hvMcal9_Xq9oD6fj.png",
  mascotAnimation:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/rhas5fxa_Muk_Buddy_Animation_gif.webm",
  productVideo:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/rhas5fxa_Muk_Buddy_Animation_gif.webm",

  // === SECTION SLOTS — point to user-provided where possible, stock as fallback ===

  // Hero bg (not actively used; Hero uses halftone+gradients)
  heroBg:
    "https://images.unsplash.com/photo-1690983320828-c01b88baacb0?crop=entropy&cs=srgb&fm=jpg&w=2400&q=70",

  // Problem — Disposable Bags card (USER PHOTO)
  problemBags:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/w9xec8bp_ChatGPT%20Image%20Apr%2023%2C%202026%2C%2009_50_47%20AM.png",
  // Problem — Bag-less card (USER PHOTO — contractor showing dirty clogged filter inside vac)
  problemBagless:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/8d796pub_tJBwXjtJYkt4E5VEQ402d_cxF6tjyA.png",

  // Airflow bg (no longer rendered in Airflow.jsx; kept for safety)
  airflowBg:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=2000&q=70",

  // Difference / In The Field card (USER PHOTO — vest contractor with shop-vac)
  difference:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/r61bro8a_generated-image%20%2816%29.png",

  // Benefits — wide crew banner (still stock — needs a real positive crew shot)
  benefitsBanner:
    "https://images.pexels.com/photos/1216544/pexels-photo-1216544.jpeg?auto=compress&cs=tinysrgb&w=2000",

  // Dry performance — drywall / fine dust (USER PHOTO — vest contractor in demolished drywall room)
  dry:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/kd9yw6ds_DK-bg-Ynwa-0U6hvMcal9_Xq9oD6fj.png",

  // Wet performance (still stock — needs a real wet jobsite shot)
  wet: "https://images.pexels.com/photos/3616735/pexels-photo-3616735.jpeg?auto=compress&cs=tinysrgb&w=1400",

  // Waste / "Today's mess" card (USER PHOTO — jacket contractor at messy floor reused)
  waste:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/artehkve_rG9W0_LOMloE0ETffKBEC_NKsgEj17.png",

  // Testimonial portraits (still stock — needs real customer photos)
  portrait1:
    "https://images.pexels.com/photos/8961068/pexels-photo-8961068.jpeg?auto=compress&cs=tinysrgb&w=400",
  portrait2:
    "https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=400",
  portrait3:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=70",
  portrait4:
    "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=400",

  // Final CTA bg (mostly hidden behind purple halftone overlay; kept stock for now)
  finalCta:
    "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=2000",

  // 2-Chamber visual (legacy; TwoChamber section now plays mascotAnimation)
  twoChamberDiagram:
    "https://customer-assets.emergentagent.com/job_6a1c42fd-4a04-4cd3-85c8-fa888b7ecaa2/artifacts/nn8s1cjy_Product%20Shot2.png",
};
