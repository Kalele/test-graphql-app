export type Query = {
  getSwap: Swap
  getPerson: Person
  getPersonByPage(page: number): Swap
  getPersonByName(name: string): Swap
}

export type Person = {
  name: string;
  height: string;
  mass: string;
  gender: string;
  homeworld: string;
}

export type Swap = {
  count: string;
  next: string;
  previous: string;
  results: Person[];
}
