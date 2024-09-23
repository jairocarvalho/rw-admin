export const isValidPassword = (password: string) => {
  if (password.length === 0) {
    return;
  }
  const re = /[0-9a-zA-Z]{6,}/;
  return re.test(password);
};

export function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const imageTypeRegex = /image\/(png|jpg|jpeg)/gm;
