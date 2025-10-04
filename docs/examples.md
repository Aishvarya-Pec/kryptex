4 — Example user prompt → expected Scene JSON snippet (short)

User filled prompt (example):

Title: Neon Portfolio  
SiteType: portfolio  
PrimaryGoal: showcase 8 projects and contact leads  
Theme: neon cyberpunk, purple/pink, subtle glow  
Key Elements: center hero 'Aishvarya' floating, orbit menu of 6 planets (About/Work/Contact...), spinning product cube gallery for projects.  
Assets: asset://logo_01 (svg), asset://photo_01 (png), asset://model_cube_01 (glb)  
Target devices: desktop + mobile  
Performance: 2500 KB budget  
Interactions: click planet → scroll to section, click project cube → open modal with project details  
Export: ZIP

Expected (abridged) JSON snippet — LLM must return full schema, but here is a tiny example:

```
{
  "metadata": {"id":"scene_neon_001","version":"1.0","siteType":"portfolio","author":"user"},
  "theme":{"palette":{"primary":"#9f5cff","accent":"#ff4db8"},"mood":"neon-cyberpunk","density":"medium"},
  "camera":{"type":"orbit","position":[0,1.4,6],"fov":50,"controls":{"enableZoom":true}},
  "assets":[
    {"id":"asset_logo_01","type":"svg","src":"asset://logo_01","sizeBytes":2345},
    {"id":"asset_model_cube_01","type":"glb","src":"asset://model_cube_01","sizeBytes":1200000,"lods":["asset://model_cube_01_lod1"]}
  ],
  "objects":[
    {"id":"obj_heroText_01","type":"text","prefab":"HeroFloatingText","transform":{"position":[0,1.2,0],"scale":[1.6,1.6,1]},"props":{"text":"Aishvarya","font":"Inter-Bold","floatAmplitude":0.12},"material":{"preset":"neonGlow"},"interactions":{"onClick":"interactions.scrollTo(section_work)"}},
    {"id":"obj_orbitMenu_01","type":"group","prefab":"OrbitMenu","props":{"items":[{"label":"Work","action":"scrollTo:section_work"},{"label":"Contact","action":"openModal:contact"}],"radius":2.6,"rotationSpeed":0.02}}
  ],
  "ui":{"fallbacks":[{"selector":"hero","poster":"asset://photo_01"}]},
  "interactions":{
    "scrollTo:section_work":{"type":"cameraMove","target":[0,0,3],"duration":800},
    "openModal:contact":{"type":"openDOMModal","modalId":"contactModal"}
  },
  "performance":{"budgetKB":2500,"maxDrawCalls":200,"fallback":"poster"},
  "exportHints":{"framework":"nextjs-r3f","entryComponent":"components/ScenePlayer.tsx","deployTarget":"zip"}
}
```

5 — Useful follow-up prompts & tweaks (copy-paste into app)

Change theme:

"Update Scene JSON: change theme to 'minimal matte white' and convert neon materials to matte with soft drop shadows. Return only updated JSON."

Reduce motion:

"Update Scene JSON: reduce all rotation/float speeds by 50% for accessibility and add 'prefers-reduced-motion' switch in ui.controls."

Replace asset:

"Replace asset id asset://model_old_01 with asset://model_new_01 across the Scene JSON, keep same LOD hints, and return updated JSON."


6 — Validation checklist (automated)

After LLM returns JSON, run these checks automatically:

1. JSON Schema validate (fail -> request fix).
2. All assets[*].src exist in your asset store. If missing, mark placeholders.
3. objects have unique IDs and interactions referenced exist.
4. performance.budgetKB is realistic vs sum(assets.sizeBytes).
5. exportHints.framework is supported.

If any fail, call the LLM with a short diagnostic prompt:

"Last Scene JSON failed validation: <list errors>. Fix the JSON to satisfy schema and resolve missing assets (use placeholders asset://generated/<desc> for missing ones). Return only the corrected JSON."


7 — Edge rules so the output isn't "same for everyone"

Make the LLM follow composition rules:

- If siteType=portfolio → favor large hero text, project gallery as 3D cards, personal CTA + contact modal.
- If siteType=product → produce central product model with interactive spins, material swatches, buy CTA, and "addToCart" interactions.
- If siteType=ecommerce → include lightweight cart state and product quick view modals.
- If user uses at least one asset glb > 500KB → automatically generate LODs and include assets[].lods references and performance.optimizations with suggestions (Draco, texture compression).
- If user requests AR/VR → add exportHints.webxr: true and include ephemeral AR entry button UI and instructions.