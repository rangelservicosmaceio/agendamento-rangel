import type { MetadataRoute } from 'next';

const BASE_URL = 'https://rangelmaridodealuguel.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  const paginas = ['', '/servicos', '/sobre', '/depoimentos', '/duvidas', '/preco', '/agendamento'];

  return paginas.map((caminho) => ({
    url: `${BASE_URL}${caminho}`,
    lastModified: agora,
    changeFrequency: 'monthly' as const,
    priority: caminho === '' ? 1 : 0.8,
  }));
}
