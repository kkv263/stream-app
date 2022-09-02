/** @type {import('@sveltejs/kit').ParamMatcher} */
export const match = (param) => {
  return /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/.test(param);
};