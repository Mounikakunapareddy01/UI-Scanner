// import React, { useState } from 'react';
// import ColorContrastChecker from 'color-contrast-checker';

// function isValidCssColor(str) {
//   // Simple check: hex, rgb, or common names
//   return /^#[0-9a-fA-F]{3,8}$/.test(str)
//     || /^rgb\((\d{1,3},\s*){2}\d{1,3}\)$/.test(str)
//     || /^(white|black|red|blue|green|gray|grey|yellow|orange|purple)$/.test(str.toLowerCase());
// }

// export default function ContrastChecker() {
//   const [fg, setFg] = useState('#222');
//   const [bg, setBg] = useState('#fff');
//   const [invalid, setInvalid] = useState(false);

//   // Real-time validation
//   React.useEffect(() => {
//     setInvalid(!isValidCssColor(fg) || !isValidCssColor(bg));
//   }, [fg, bg]);

//   // Only run checker when colors are valid
//   let isGoodContrast = null;
//   if (!invalid) {
//     const ccc = new ColorContrastChecker();
//     isGoodContrast = ccc.isLevelAA(fg, bg, 14);
//   }

//   function handleAutoFix() {
//     setFg('#222');
//     setBg('#fff');
//     setInvalid(false);
//   }

//   return (
//     <div style={{
//       background: bg, color: fg, padding: 20, border: "1px solid #ccc", borderRadius: 8, marginBottom: 20
//     }}>
//       <h3>Color Contrast Checker</h3>
//       <label>
//         Foreground color:
//         <input type="text" value={fg} onChange={e => setFg(e.target.value)} />
//       </label>
//       <label style={{ marginLeft: 20 }}>
//         Background color:
//         <input type="text" value={bg} onChange={e => setBg(e.target.value)} />
//       </label>
//       <div style={{ marginTop: 10 }}>
//         {invalid ? (
//           <div style={{ color: '#EA4C89', marginTop: 8 }}>
//             <b>Invalid color!</b> Please provide a CSS hex code (e.g., <code>#FFFFFF</code>), a named color (e.g., <code>white</code>), or valid rgb value.<br />
//             <button style={{
//               marginTop: 10, background: '#0A72EF', color: '#fff', borderRadius: 5, border: 0, padding: '4px 14px'
//             }} onClick={handleAutoFix}>
//               Auto-Fix to Safe Colors
//             </button>
//           </div>
//         ) : (
//           <p>
//             Contrast: {isGoodContrast == null ? "--" : isGoodContrast ? "✅ Passes WCAG AA" : "❌ Fails WCAG AA"}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
