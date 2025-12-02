import { encode, decode } from '@toon-format/toon'

// Convert JSON to TOON
export const toToon = (obj) => {
    try {
        return encode(obj);
    } catch (e) {
        console.error('Error converting to TOON:', e);
        return '';
    }
};

// Convert TOON to JSON
export const fromToon = (str) => {
    if (!str || str.trim() === '') {
        return null;
    }

    try {
        return decode(str);
    } catch (e) {
        console.error('Error decoding TOON:', e);
        return null;
    }
};

// Utility function to manage theme in local storage
export function getInitialTheme() {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme ? savedTheme : 'light';
}

export function saveTheme(theme) {
  localStorage.setItem('theme', theme);
}
