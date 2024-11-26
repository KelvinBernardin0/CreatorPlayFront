import { NamedValue, NamedValueWithImage } from 'src/app/common/types/NamedValue';

export const headers: NamedValueWithImage<string>[] = [
  {
    name: 'Imagem Grande',
    value: 'assets/componentes/headers/headers_imagem_grande.html',
    hasImage: true,
  },
  {
    name: 'Imagem Grande Inverso',
    value: 'assets/componentes/headers/headers_imagem_grande_inverso.html',
    hasImage: true,

  },
  {
    name: 'Imagem Pequena',
    value: 'assets/componentes/headers/headers_imagem_pequena.html',
    hasImage: true,

  },
  {
    name: 'Imagem Pequena Inverso',
    value: 'assets/componentes/headers/headers_imagem_pequena_inverso.html',
    hasImage: true,

  },
  {
    name: 'Sem Imagem',
    value: 'assets/componentes/headers/headers_sem_imagem.html',
    hasImage: false,

  },
  {
    name: 'Sem Imagem Inverso',
    value: 'assets/componentes/headers/headers_sem_imagem_inverso.html',
    hasImage: false,
  },
];
