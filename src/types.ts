export interface Question {
  title: string;
  imageUrl: string;
  answer: string;
  province: string;
}

export interface DataPoint {
  nome_comune: string;
  codice_provincia: string;
  lat: number;
  lon: number;
  superficie_kmq: number;
  flag_capoluogo: string;
  pageviews: number;
  provincia: string;
  regione: string;
  abitanti: number | null;
  immagine: string;
}
