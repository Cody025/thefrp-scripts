// © 2025 InkedMonkey — Unauthorized reuse prohibited
// This script handles first name personalization across cf funnel pages with preserved styling.

console.log("Script loaded");

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
          const computedStyles = window.getComputedStyle(element);
          const initialColor = computedStyles.getPropertyValue('color');
          console.log("[🔶] Initial color:", initialColor); // Debug initial color
          for (let style of computedStyles) {
            styledSpan.style[style] = computedStyles.getPropertyValue(style);
          }
          // Set color explicitly
          styledSpan.style.color = initialColor;
          ['font', 'fontFamily', 'fontWeight', 'fontSize', 'letterSpacing', 'lineHeight', 'textAlign', 'textTransform', 'fontStyle'].forEach(style => {
            styledSpan.style[style] = computedStyles.getPropertyValue(style) || '';
          });
          styledSpan.style.display = 'inline';
          styledSpan.style.whiteSpace = 'nowrap'; // Keep Cody on one line
          // Split and replace only the {{first_name}} part
          const originalHTML = element.innerHTML;
          if (originalHTML.includes('{{first_name}}')) {
            const parts = originalHTML.split('{{first_name}}');
            const newHTML = parts[0] + styledSpan.outerHTML + parts[1];
            element.innerHTML = newHTML.trim();
            // Reapply color after a delay to catch CF styling
            setTimeout(() => {
              const finalSpan = element.querySelector('span');
              if (finalSpan) {
                const finalColor = window.getComputedStyle(element).getPropertyValue('color');
                finalSpan.style.color = finalColor || initialColor; // Fallback to initial if computed fails
                console.log("[🔷] Final color applied:", finalColor || initialColor); // Debug final color
              }
            }, 100); // Short delay to allow CF styling
            console.log("[🔵] Replacing text node:", originalHTML, "->", element.textContent);
          }
          element.style.overflowWrap = 'break-word'; // Allow wrapping for long text
          element.style.wordBreak = 'break-word'; // Ensure word breaks if needed
        } else if (element.textContent.includes('{{first_name}}')) {
          element.innerText = element.innerText.replace(/{{first_name}}/g, 'friend');
          console.log("[🟨] Replaced with friend to:", element.textContent);
        } else {
          console.log("[🟡] No {{first_name}} found in:", element.textContent);
        }
        element.setAttribute('data-personalized', 'true');
      });
    } else {
      console.log("[🔴] No elements with data-role='personalized-greeting' found");
    }
  }

  replaceFirstName();
  setTimeout(replaceFirstName, 2000);
  setTimeout(replaceFirstName, 5000);
});
