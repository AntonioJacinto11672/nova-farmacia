export interface ProvinceApiType {
  nome: string
  slug: string
  extensao?: string
  data_fundacao: string
  capital: CapitalApi
  municipios: MunicipioApiType[]
  etnias: EtniaApiType[]
  linguas: LinguaApiType[]
}

export interface CapitalApi {
  nome: string
  slug: string
}

export interface MunicipioApiType {
  nome: string
  slug: string
  distritos: any[]
  comunas: ComunaApi[]
}

export interface ComunaApi {
  nome: string
  slug: string
}

export interface EtniaApiType {
  nome: string
  slug: string
}

export interface LinguaApiType {
  nome: string
  slug: string
}
