function markReady(element) {
    element.dataset.splitReady = "true";
  }
  
  export function splitChars(element) {
    if (!element || element.dataset.splitReady === "true") {
      return element ? Array.from(element.querySelectorAll(".v4-char")) : [];
    }
  
    const text = element.textContent || "";
    const label = text.replace(/\s+/g, " ").trim();
  
    element.textContent = "";
    if (label) element.setAttribute("aria-label", label);
  
    const fragment = document.createDocumentFragment();
    const chars = [];
  
    Array.from(text).forEach((char) => {
      const span = document.createElement("span");
      span.setAttribute("aria-hidden", "true");
  
      if (/\s/.test(char)) {
        span.className = "v4-char v4-char-space";
        span.innerHTML = "&nbsp;";
      } else {
        span.className = "v4-char";
        span.textContent = char;
        chars.push(span);
      }
  
      fragment.appendChild(span);
    });
  
    element.appendChild(fragment);
    markReady(element);
    return chars;
  }
  
  export function splitWords(element) {
    if (!element || element.dataset.wordSplitReady === "true") {
      return element ? Array.from(element.querySelectorAll(".v4-word")) : [];
    }
  
    const text = (element.textContent || "").replace(/\s+/g, " ").trim();
    if (!text) return [];
  
    element.textContent = "";
    element.setAttribute("aria-label", text);
  
    const words = [];
  
    text.split(" ").forEach((word, index, all) => {
      const span = document.createElement("span");
      span.className = "v4-word";
      span.setAttribute("aria-hidden", "true");
      span.textContent = word;
      element.appendChild(span);
      words.push(span);
  
      if (index < all.length - 1) {
        element.appendChild(document.createTextNode(" "));
      }
    });
  
    element.dataset.wordSplitReady = "true";
    return words;
  }
  