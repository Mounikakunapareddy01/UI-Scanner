import React, { useState } from 'react';
import axios from 'axios';
import ColorContrastChecker from 'color-contrast-checker';

// Utility to check contrast
function getContrastPass(fg, bg) {
  const ccc = new ColorContrastChecker();
  try {
    return ccc.isLevelAA(fg, bg, 14);
  } catch {
    return null;
  }
}

// Collect summary info for AI
function getPageInfoForAI() {
  const bg = getComputedStyle(document.body).backgroundColor;
  const texts = Array.from(document.querySelectorAll('p, h1, h2, h3, .card, .about-section')).map(e => e.textContent);
  const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
    text: b.textContent,
    color: getComputedStyle(b).color,
    bg: getComputedStyle(b).backgroundColor,
    width: b.offsetWidth,
    height: b.offsetHeight
  }));
  const images = Array.from(document.querySelectorAll('img')).map(img => ({
    src: img.src,
    alt: img.alt
  }));
  return {
    background: bg,
    texts,
    buttons,
    images
  };
}

export default function UIChecker() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState("");

  // Scan page and collect rule-based suggestions
  async function handleScan() {
    const found = [];

    // Buttons: contrast + size
    document.querySelectorAll('button').forEach(btn => {
      const style = getComputedStyle(btn);
      const contrast = getContrastPass(style.color, style.backgroundColor);
      if (contrast === false) {
        found.push({
          type: 'Button',
          suggestion: `Button "${btn.textContent || 'unnamed'}" has low contrast (${style.color} on ${style.backgroundColor}). Suggest: Use white text on dark blue background.`
        });
      }
      if (btn.offsetWidth < 44 || btn.offsetHeight < 44) {
        found.push({
          type: 'Button',
          suggestion: `Button "${btn.textContent || 'unnamed'}" is too small. Suggest: Make buttons at least 44x44px for accessibility.`
        });
      }
    });

    // Images missing alt text
    document.querySelectorAll('img').forEach(img => {
      if (!img.alt || img.alt.trim() === '') {
        found.push({
          type: 'Image',
          suggestion: `Image "${img.src}" is missing alt text. Suggest: Use alt="A descriptive label for the image".`
        });
      }
    });

    // Links with vague text
    document.querySelectorAll('a').forEach(link => {
      if (/click here|learn more|here/i.test(link.textContent)) {
        found.push({
          type: 'Link',
          suggestion: `Link text "${link.textContent}" is ambiguous. Suggest: Use descriptive link text, e.g., "Learn about accessibility".`
        });
      }
    });

    // Headings too short
    document.querySelectorAll('h1, h2, h3').forEach(heading => {
      if (heading.textContent.trim().length < 5) {
        found.push({
          type: 'Heading',
          suggestion: `Heading "${heading.textContent}" is too brief. Suggest: Make headings more descriptive for screen readers.`
        });
      }
    });

    // Paragraphs too long/complex
    document.querySelectorAll('p, .card, .about-section').forEach(el => {
      const text = el.textContent || '';
      if (text.split(' ').length > 30) {
        found.push({
          type: 'Text',
          suggestion: `A paragraph/section is very long or complex. Suggest: Simplify text and break into shorter sentences for readability.`
        });
      }
    });

    // Missing <main> landmark
    if (!document.querySelector('main')) {
      found.push({
        type: 'Layout',
        suggestion: "No <main> landmark detected. Suggest: Wrap your core content in a <main> tag for accessibility."
      });
    }

    setSuggestions(found);
    setPanelOpen(true);
    setAiSuggestions(""); // Reset AI suggestions on new scan
  }

  // Fetch suggestions from OpenAI backend, fallback to dummy tips
  async function handleAIScan() {
    const pageInfo = getPageInfoForAI();
    setAiSuggestions("Getting AI suggestions...");
    try {
      const res = await axios.post(
        'http://localhost:5000/api/openai-scan',
        { pageInfo }
      );
      setAiSuggestions(res.data.suggestions || "No AI suggestions received.");
    } catch {
      // === Fallback: Dummy suggestions! ===
      setAiSuggestions(
        `OpenAI (Demo Mode Suggestions):\n
1. Consider using a softer background color for improved readability.
2. Button "${(pageInfo.buttons[0] ? pageInfo.buttons[0].text : "Start")}" seems small; use at least 44x44px for accessibility.
3. Use light text on dark backgrounds for better contrast.
4. Break long paragraphs into short sentences for easy reading.
5. Add descriptive alt text to all images.
6. Wrap your key content in a <main> tag for screen reader support.
7. Check that all interactive elements (like buttons and links) have clear labels.`
      );
    }
  }

  return (
    <>
      {/* Scan button at side */}
      <button
        style={{
          position: 'fixed',
          right: 18,
          top: 130,
          zIndex: 10000,
          padding: '14px 18px',
          background: '#0A72EF',
          color: '#fff',
          border: 'none',
          borderRadius: '50px 0 0 50px',
          fontWeight: 600,
          boxShadow: '0 2px 16px #0003',
        }}
        onClick={handleScan}
        aria-label="Scan Page for Accessibility"
      >
        🔎 Scan Page
      </button>
      {/* Suggestions panel only appears after Scan */}
      {panelOpen && (
        <div style={{
          position: 'fixed',
          right: 0,
          top: 200,
          width: 340,
          background: '#fff',
          borderLeft: '3px solid #EA4C89',
          borderRadius: '16px 0 0 16px',
          boxShadow: '0 2px 18px #0002',
          padding: 24,
          zIndex: 9999,
          maxHeight: '70vh',
          overflowY: 'auto',
        }}>
          <button
            style={{
              position: 'absolute', top: 8, right: 10, background: 'none',
              border: 'none', color: '#EA4C89', fontSize: 22, cursor: 'pointer'
            }}
            onClick={() => setPanelOpen(false)}
            title="Close"
            aria-label="Close panel"
          >×</button>
          <h3 style={{ marginBottom: 8 }}>Accessibility Suggestions</h3>
          {suggestions.length === 0 ? (
            <div style={{ color: '#228B22', fontWeight: 'bold', fontSize: 17, marginTop: 18 }}>
              No major issues detected! 🎉
              <div style={{ fontSize: 14, marginTop: 6, color: '#444' }}>Your page passes key accessibility checks.</div>
            </div>
          ) : (
            <ul style={{ padding: 0, marginTop: 12 }}>
              {suggestions.map((sugg, idx) => (
                <li key={idx} style={{ marginBottom: 16, fontSize: 15, color: '#222' }}>
                  <b>[{sugg.type}]</b> <br />
                  <span style={{ color: "#EA4C89" }}>{sugg.suggestion}</span>
                </li>
              ))}
            </ul>
          )}
          <button
            style={{
              marginTop: 12, background: '#FFD700', color: '#222', borderRadius: 6,
              border: 'none', padding: '8px 18px', fontWeight: 600, fontSize: 15, boxShadow: '0 1px 8px #FFD70022'
            }}
            onClick={handleAIScan}
          >
            💡 Run OpenAI Suggestions
          </button>
          {aiSuggestions && (
            <div style={{
              background: '#FFF7E0', color: '#333', borderRadius: 8,
              margin: '16px 0 0 0', padding: 14, boxShadow: '0 2px 12px #FFD70044'
            }}>
              <h4 style={{ margin: '0 0 8px 0' }}>OpenAI Suggestions:</h4>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: 16 }}>{aiSuggestions}</pre>
            </div>
          )}
        </div>
      )}
    </>
  );
}
