// utils.js

// Set cookie with expiry in hours
function setCookie(name, value, hours) {
  const d = new Date();
  d.setTime(d.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value};path=/;expires=${d.toUTCString()}`;
}

// Get cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Delete cookie
function deleteCookie(name) {
  document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC`;
}
