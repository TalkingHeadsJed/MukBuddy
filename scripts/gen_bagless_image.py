"""One-shot image generation: clogged filter + smoking motor in Muk Buddy DTC style."""
import asyncio
import base64
import os
import sys
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv("/app/backend/.env")

PROMPT = """Bold DTC editorial illustration in the style of Liquid Death / Dr. Squatch packaging art.
Subject: A wrecked, badly clogged pleated shop-vac filter caked in thick gray drywall dust,
sitting next to a smoking, burnt-out wet/dry vacuum motor with wisps of black smoke curling up.
Aesthetic: hand-drawn comic / sticker illustration, thick bold black ink outlines, halftone shading,
slime-green and deep purple accents, warm cream/off-white background (#F4ECD8).
Mood: gross, comedic, cautionary — the "bagless contractor" disaster.
Composition: centered hero composition with empty cream space around for layout breathing room,
NO text or words in the image, NO logos, NO captions. Just the illustration.
Style references: bold contour lines, screen-print poster, retro cartoon, slightly grimy texture,
slime drips, dust particles floating in air. Highly readable silhouette.
Aspect ratio roughly square (1:1)."""


async def main():
    api_key = os.getenv("EMERGENT_LLM_KEY")
    if not api_key:
        print("ERR: EMERGENT_LLM_KEY missing")
        sys.exit(1)

    chat = LlmChat(
        api_key=api_key,
        session_id="muk-buddy-bagless-image",
        system_message="You are a brand illustrator producing bold DTC packaging-style art.",
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(
        modalities=["image", "text"]
    )

    msg = UserMessage(text=PROMPT)
    text, images = await chat.send_message_multimodal_response(msg)
    print(f"Text response: {text[:200] if text else '(none)'}")

    if not images:
        print("ERR: no images returned")
        sys.exit(2)

    out_dir = "/app/frontend/public"
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "bagless-disaster.png")
    image_bytes = base64.b64decode(images[0]["data"])
    with open(out_path, "wb") as f:
        f.write(image_bytes)
    print(f"OK saved: {out_path}  ({len(image_bytes)} bytes)")


if __name__ == "__main__":
    asyncio.run(main())
