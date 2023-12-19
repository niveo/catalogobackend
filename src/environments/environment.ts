export const envVercel = Boolean(process.env.ENV_VERCEL);
export const envTest = !process.env.ENV_TESTE
  ? false
  : Boolean(process.env.ENV_TESTE);
