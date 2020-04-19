export interface Node {
  name: string;
  uri: string;
  children?: Node[];
}

export interface Series {
  name: string;
  series: {
    value: any;
    name: string;
  }[];
}

export interface Bar {
  value: number;
  name: string;
}


/**
 * filtro dei dati per il valore della chiave selezionata
 * @param data[] array dei dati 
 * @param key la chiave 
 * @param value il valore da filtrare
 */
export function filterData(data: any[], key: string, value: string): any[] {
  const filterSeries = (input) => {
    return input[key].match(new RegExp('^' + value, 'i'));
  }
  return data.filter(filterSeries)
}

export function getDailyRows(data: any[], day: string = null): any[] {
  if (day) {
    return filterData(data, 'data', day)
  }
  return filterData(data, 'data', data[data.length - 1].data)
}

export function encode(province:string): string {
  return province == 'In fase di definizione/aggiornamento' ? `NOT ATTRIBUTED YET` : province
}

export function decode(province:string): string {
  return province == `NOT ATTRIBUTED YET` ? 'In fase di definizione/aggiornamento' : province
}

export function getTree(data:any[]): Node[] {
  const tree: Node[] = [{
    name: `Italy`,
    uri: '/',
    children: []
  }];
  data = getDailyRows(data);
  let regions = {}
  for (const row of data) {
    const region = row.denominazione_regione
    if (!regions[region]) {
      regions[region] = {
        uri: `/${region}`,
        name: region,
        children: []
      }
      tree[0].children.push(regions[region])
    }
    const province = encode(row.denominazione_provincia)
    regions[region].children.push({
      uri: `/${region}/${province}`,
      name: province
    });
  }
  return tree
}


export function orderValueDesc (a, b)  {
  return a.value > b.value ? -1 : 1

}

export function orderDesc (a,b) {
  return a > b ? -1 : 1
}
