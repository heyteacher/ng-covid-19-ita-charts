import moment from 'moment';

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

export function encode(province: string): string {
  return province == 'In fase di definizione/aggiornamento' ? `NOT ATTRIBUTED YET` : province
}

export function decode(province: string): string {
  return province == `NOT ATTRIBUTED YET` ? 'In fase di definizione/aggiornamento' : province
}

export function getTree(data: any[]): Node[] {
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


export function orderValueDesc(a, b) {
  return a.value > b.value ? -1 : 1

}

export function orderDesc(a, b) {
  return a > b ? -1 : 1
}

export function getValue(input: any, keyValue: string, denomKey: string) {
  const denomValue = denomKey && input[denomKey] >= 0 ? input[denomKey] : 0;
  const value = denomKey == null ?
    parseFloat(input[keyValue]) :
    denomValue > 0 ?
      Math.min((Math.floor((input[keyValue] / denomValue) * 10000) / 100), 100) :
      0;
  return value;
}

/**
 * Calculate the max value of last data days
 * @param inputData the input data
 * @param keyValue the key of value
 * @param denominatorKey the key of denominator
 * @param lastDays the number of last days to consider
 * @return the max value of last data days
 */
export function getMaxValue(
  inputData: any[],
  keyValue: string,
  denominatorKey: string,
  lastDays: number
): number {
  const findMaxBar = (previous: any, current: any, currentIdx: number, array: any[]): Bar => {
    // ignore days not showed
    if (moment(current.data).isBefore(moment().subtract(lastDays, 'day'))) {
      return current
    }
    if (currentIdx == 0) {
      return current
    }
    if (getValue(current, keyValue, denominatorKey) > getValue(previous, keyValue, denominatorKey)) {
      return current
    }
    else {
      return previous
    }
  }
  const maxRow: any = inputData.reduce(findMaxBar)
  return maxRow ? getValue(maxRow, keyValue, denominatorKey) : null
}


/**
 * calculate the percentage value
 * @param input the input value
 * @param keyValue the key of value
 * @param denominatorKey the key of denominator
 * @param maxValue the maximum value returned
 * @return the percentage value
 */
export function getPercentageValue(input: any, valueKey: string, denominatorKey: string, maxValue: number = 100) {
  const denomValue = denominatorKey && input[denominatorKey] > 0 ? input[denominatorKey] : 0;
  let value = denominatorKey == null ?
    input[valueKey] :
    denomValue > 0 ?
      Math.min((Math.floor((input[valueKey] / denomValue) * 10000) / 100), maxValue) :
      0;
  return value;
}
