#!/usr/bin/env bash
# Generates the 6 service-card photos for /female-family-medicine with gpt-image-2.
# Requires OPENAI_API_KEY in .env.local with available billing credit.
# Run from the repo root:  bash scripts/generate-female-family-service-images.sh
set -euo pipefail

GEN=".claude/skills/gpt-image-2/scripts/generate.mjs"
OUT="public/female-family/services"
mkdir -p "$OUT"

STYLE="Premium editorial healthcare photography for a high-end women's and family clinic in Saudi Arabia. Photorealistic, calm and reassuring atmosphere, soft natural window light, bright modern clinic interior with warm cream, soft rose and teal accents. Modest attire throughout, magazine-quality color grading, shallow depth of field, no text rendered in the image. 3:2 landscape framing."

gen() { # $1 = output name, $2 = scene prompt
  node "$GEN" \
    --prompt "$STYLE $2" \
    --output "$OUT/$1.webp" \
    --size 1536x1024 --quality high \
    --output-format webp --output-compression 90
}

gen pregnancy "A young Saudi mother-to-be wearing an elegant cream-colored hijab and a modest flowing dress, seated in a consultation room, smiling softly with her hands gently resting on her baby bump, while a caring female Saudi doctor in a white coat and hijab sits beside her holding a tablet and reassuring her." &
gen mother-baby "A Saudi mother wearing a soft blush-pink hijab cradling her newborn baby wrapped in a white blanket, while a gentle female Saudi pediatric doctor in a white coat and hijab leans in with a stethoscope to check the sleeping baby, in a bright modern clinic room." &
gen screening "A confident Saudi woman in an elegant navy hijab and modest attire sitting across a modern desk from a female Saudi doctor in a white coat and hijab, who is presenting preventive health-screening results on a sleek tablet; a modern diagnostic room with soft teal accents behind them." &
gen gynecology "A warm, discreet consultation scene: a female Saudi gynecologist in a white coat and hijab sitting in a private, elegant consultation office, speaking kindly with a female patient in a modest beige hijab; soft privacy curtains and a modern examination room softly blurred in the background, conveying complete privacy and trust." &
gen family "A happy young Saudi family — a father in a crisp white thobe and ghutra, a mother in an elegant dark abaya and hijab, and their two smiling young children — being warmly welcomed by a female Saudi family doctor in a white coat and hijab in a bright modern clinic lobby." &
gen nutrition "A serene Saudi woman in a sage-green hijab consulting with a female Saudi clinical nutritionist in a white coat and hijab at a bright modern clinic table topped with a bowl of fresh fruit, a glass of water and a meal-plan journal, both smiling in a relaxed wellbeing session." &

wait
echo "Done:"
ls -la "$OUT"
