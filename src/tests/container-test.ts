import { dockerCommand } from 'docker-cli-js';

export const criarContainer = async () => {
  await dockerCommand('compose up -d postgres');
  await sleep(3000);
};
export const removerContainer = async () => {
  await dockerCommand('compose down postgres');
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
