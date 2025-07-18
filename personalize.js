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
          const range = document.createRange();
          const styledSpan = document.createElement('span');
          styledSpan.textContent = firstName;
          const computedStyles = window.getComputedStyle(element);
          for (let style of computedStyles) {
            styledSpan.style[style] = computedStyles.getPropertyValue(style);
          }
          ['font', 'fontFamily', 'fontWeight', 'fontSize', 'color', 'letterSpacing', 'lineHeight', 'textAlign', 'textTransform', 'fontStyle'].forEach(style => {
            styledSpan.style[style] = computedStyles.getPropertyValue(style) || '';
          });
          styledSpan.style.display = 'inline'; // Ensure inline behavior
          styledSpan.style.whiteSpace = 'nowrap'; // Prevent internal breaks
          // Find and replace the placeholder text node
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = element.innerHTML;
          const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null, false);
          let node;
          while ((node = walker.nextNode())) {
            if (node.nodeValue.includes('{{first_name}}')) {
              range.selectNode(node);
              const fragment = range.extractContents();
              const newSpan = styledSpan.cloneNode(true);
              range.insertNode(newSpan);
              element.innerHTML = tempDiv.innerHTML.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();
              break;
            }
          }
          element.style.whiteSpace = 'nowrap'; // Prevent parent breaks
          element.style.overflow = 'hidden'; // Handle overflow
          element.style.textOverflow = 'ellipsis'; // Optional: truncate if too long
          console.log("[🟩] Replaced to:", element.textContent);
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
