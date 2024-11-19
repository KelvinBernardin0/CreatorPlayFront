import {PropertyState} from "./propertie-state";


export type NamedPathState = {
  imagePath: string;
  text: PropertyState;
};

export const blocks: NamedPathState[] = [
  {
    imagePath: 'assets/imagens/blocos/texto-icon.png',
    text: 'Texto',
  },
  {
    imagePath: 'assets/imagens/blocos/imagem-icon.png',
    text: 'Imagem',
  },
  {
    imagePath: 'assets/imagens/blocos/botao-icon.png',
    text: 'Botão',
  },
  {
    imagePath: 'assets/imagens/blocos/cards-icon.png',
    text: 'Cards',
  },
  {
    imagePath: 'assets/imagens/blocos/planos-icon.png',
    text: 'Planos',
  },
  {
    imagePath: 'assets/imagens/blocos/vitrine-icon.png',
    text: 'Vitrine',
  },
];
