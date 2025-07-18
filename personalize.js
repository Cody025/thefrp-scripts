// © 2025 InkedMonkey — Unauthorized reuse prohibited
// This script handles first name personalization across CF funnel pages with preserved styling.

document.addEventListener('DOMContentLoaded', function() {
  function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    var cookie = parts.length === 2 ? decodeURIComponent(parts.pop().split(";").shift()) : '';
    console.log("[🔵] Cookie check for", name + ":", cookie);
    return cookie;
  }

  function replaceFirstName() {
    var firstName = getCookie("contact_first_name");
    if (!firstName) {
      console.log("[🟠] No firstName, checking form submission...");
      var formSubmitted = document.querySelector('form[cf-submitted]');
      if (formSubmitted) console.log("[🟢] Form submitted, but cookie missing");
      else console.log("[🔴] Form not submitted or cookie not set");
    }

    var greetingElements = document.querySelectorAll('[data-role="personalized-greeting"]');
    if (greetingElements.length > 0) {
      greetingElements.forEach(element => {
        console.log("[🟢] Replacing in node, original:", element.textContent);
        if (firstName && element.textContent.includes('{{first_name}}')) {
          const styledSpan = document.createElement('span');
          styledSpan.textContent = firstName;

          // Get and apply computed styles dynamically
          function applyParentStyles() {
            const computedStyles = window.getComputedStyle(element);
            const parentColor = computedStyles.getPropertyValue('color');
            console.log("[🔶] Parent color:", parentColor);

            // Apply all relevant styles
            ['font', 'fontFamily', 'fontWeight', 'fontSize', 'letterSpacing', 'lineHeight', 'textAlign', 'textTransform', 'fontStyle'].forEach(style => {
              styledSpan.style[style] = computedStyles.getPropertyValue(style) || '';
            });
            styledSpan.style.display = 'inline';
            styledSpan.style.whiteSpace = 'nowrap';
            styledSpan.style.color = parentColor; // Set color without !important initially

            // Force color with higher specificity if needed
            styledSpan.setAttribute('style', `color: ${parentColor} !important; ${styledSpan.getAttribute('style') || ''}`);
          }

          applyParentStyles();

          // Split and replace only the {{first_name}} part
          const originalHTML = element.innerHTML;
          if (originalHTML.includes('{{first_name}}')) {
            const parts = originalHTML.split('{{first_name}}');
            const newHTML = parts[0] + styledSpan.outerHTML + parts[1];
            element.innerHTML = newHTML.trim();

            // Use MutationObserver to reapply color if it changes
            const observer = new MutationObserver((mutations) => {
              const finalSpan = element.querySelector('span');
              if (finalSpan) {
                const spanColor = window.getComputedStyle(finalSpan).getPropertyValue('color');
                console.log("[🔷] Span color change:", spanColor);
                if (spanColor === 'rgb(0, 0, 0)' || spanColor === '#000000') {
                  applyParentStyles(); // Reapply all styles, including color
                  console.log("[🔹] Corrected to parent color:", parentColor);
                }
              }
            });
            observer.observe(element, { childList: true, subtree: true, attributes: true });

            // Periodically check and reapply styles
            setInterval(applyParentStyles, 1000); // Check every second
          }
          console.log("[🔵] Replaced text node:", originalHTML, "->", element.textContent);
        } else if (element.textContent.includes('{{first_name}}')) {
          element.innerText = element.innerText.replace(/{{first_name}}/g, 'friend');
          console.log("[🟨] Replaced with friend to:", element.textContent);
        } else {
          console.log("[🟡] No {{first_name}} found in:", element.textContent);
        }
        element.setAttribute('data-personalized', 'true');
        element.style.overflowWrap = 'break-word';
        element.style.wordBreak = 'break-word';
      });
    } else {
      console.log("[🔴] No elements with data-role='personalized-greeting' found");
    }
  }

  // Initial and delayed replacements
  replaceFirstName();
  setTimeout(replaceFirstName, 500); // Adjusted for CFs loading
  setTimeout(replaceFirstName, 2000);
});
