2 — User Prompt Template (what users paste)

Paste this as the user input (the AI has the System prompt above):

USER PROMPT — Generate my 3D website

Title: <My site title, e.g., "Aishvarya — Portfolio">
SiteType: <portfolio|product|agency|event|onepage|ecommerce|documentation>
PrimaryGoal: <what should the site achieve? e.g., "showcase photography", "sell one product", "collect leads">
Tone & Theme: <adjectives e.g., "neon cyberpunk, high contrast, slow float" or "minimal, paper-white, soft shadows">
Layout preferences: <hero composition, left-menu, center-stage, vertical-scroller, split-screen>
Key Elements (describe in natural language): <hero text + rotating planets menu + CTA; gallery as 3D cubes; product carousel with spin-on-hover>
Assets I uploaded:
  - asset://logo_01 (type: svg)
  - asset://model_watch_01 (type: glb, optimized: false)
  - asset://photo_01 (type: png)
Target devices: <desktop,mobile,vr>
Performance budget: <e.g., 3000 KB total assets, maxDrawCalls: 300>
Interactions: <what should clicks do? e.g., "click product → open modal with details and Add to Cart" or "click planet menu → scroll to section">
Accessibility: <yes/no, include ARIA labels + keyboard nav>
Export: <exportTarget: GitHub / ZIP / Vercel>
Extra: <special requirements: AR mode, WebXR, screenshot poster fallback>

Deliverable: produce full Scene Graph JSON (schema described by system) and assets mapping using my uploaded asset IDs. Also include exportHints for Next.js + R3F and a short previewInstructions block (3 lines).

END USER PROMPT