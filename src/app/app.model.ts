import moment from 'moment';

declare function $localize(params:TemplateStringsArray)

export interface Legend {
  label: string;
  name: string;
  checked: boolean;
  color: string;
}

export interface Node {
  name: string;
  uri: string;
  children?: Node[];
}

export interface Series {
  name: string;
  key:string
  series: {
    value: any;
    name: Date;
  }[];
}

export interface ColorScheme {
  domain: String[]
}


export interface Bar {
  value: number;
  name: string;
  color?: string
}

export function objectify(dict, value) {
    dict[value.name] = value;
    return dict;
 }


 export enum AggregateEnum {
  Day = "DAY",
  Week = "WEEK",
  Month = "MONTH"
}

export enum ScaleEnum {
  Log10 = "LOG10",
  Linear = "LINEAR"
}

/**
 * filter data by key starting from value
 * @param data the data array
 * @param key the key to filter
 * @param value the value to filter
 */
export function filterByKey(data: any[], key: string, value: string): any[] {
  const filterSeries = (input) => {
    return input[key].match(new RegExp('^' + value, 'i'));
  }
  const ret = data.filter(filterSeries)
  return ret
}

/**
 * filter the data by day (starting from)
 * @param data  the data array
 * @param day the day to filter in format YYYY-MM-DD
 */
export function filterByDay(data: any[], day: string = null): any[] {
  if (day) {
    return filterByKey(data, 'data', day)
  }
  return filterByKey(data, 'data', data[data.length - 1].data)
}

/**
 * encode NOT ATTRIBUTED YET province
 * @param province the province to encode
 */
export function encodeNAYProvince(province: string): string {
  if ( province == 'In fase di definizione/aggiornamento') {
    return $localize? $localize`NOT ATTRIBUTED YET`:`NOT ATTRIBUTED YET` 
  }
  if ( province == 'Fuori Regione / Provincia Autonoma') {
    return $localize? $localize`OUT REGION`:`OUT REGION` 
  }
  return province
}

/**
 * decode NOT ATTRIBUTED YET province
 * @param province  the province to encode
 */
export function decodeNAYProvince(province: string): string {
  if (province == $localize`NOT ATTRIBUTED YET`) {
    return  'In fase di definizione/aggiornamento' 
  }
  if (province == $localize`OUT REGION`) {
    return  'Fuori Regione / Provincia Autonoma' 
  }
  return province
}

/**
 * generate region/province tree from regional data
 * @param provincialData the provincial data array 
 */
export function generateRegionProvinceTree(provincialData: any[]): Node[] {
  const tree: Node[] = [{
    name: `Italy`,
    uri: '/',
    children: []
  }];
  let regions = {}
  for (const row of provincialData) {
    const region = row.denominazione_regione
    if (!regions[region]) {
      regions[region] = {
        uri: `/${region}`,
        name: region,
        children: []
      }
      tree[0].children.push(regions[region])
    }
    const province = encodeNAYProvince(row.denominazione_provincia)
    regions[region].children.push({
      uri: `/${region}/${province}`,
      name: province
    });
  }
  return tree
}

/**
 * map function to descendent order an array of value object
 * @param a first object with value key
 * @param b second object with value key
 */
export function orderValueDesc(a, b) {
  return a.value > b.value ? -1 : 1

}

/**
 * map function to descending order an array of values
 * @param a first value
 * @param b second value
 */
export function orderDesc(a, b) {
  return a > b ? -1 : 1
}

/**
 * Calculate the max value of last data days to show
 * @param data the input data
 * @param key the key of value
 * @param denominatorKey the key of denominator
 * @param lastDaysToShow the number of last days to show
 * @return the max value of last data days
 */
export function getMaxValue(
  data: any[],
  key: string,
  denominatorKey: string,
  lastDaysToShow: number
): number {
  const findMaxBar = (previous: any, current: any, currentIdx: number, array: any[]): Bar => {
    // ignore days not showed
    if (moment(current.data).isBefore(moment().subtract(lastDaysToShow, 'day'))) {
      return current
    }
    if (currentIdx == 0) {
      return current
    }
    if (getValue(current, key, denominatorKey) > getValue(previous, key, denominatorKey)) {
      return current
    }
    else {
      return previous
    }
  }
  const maxRow: any = data.reduce(findMaxBar)
  return maxRow ? getValue(maxRow, key, denominatorKey) : null
}

/**
 * get the key value in row, if denominatorKey return the percentage
 * @param row the row
 * @param key the key of value
 * @param denominatorKey the key of denominator
 * @param percentageLimitValue the percentage limit value
 * @returns the key value in row, if denominatorKey return the percentage
 */
export function getValue(row: any, key: string, denominatorKey: string, percentageLimitValue: number = 100) {
  const denomValue = denominatorKey && row[denominatorKey] > 0 ? row[denominatorKey] : 0;
  let value = denominatorKey == null ?
    row[key] :
    denomValue > 0 ?
      Math.min((Math.floor((row[key] / denomValue) * 10000) / 100), percentageLimitValue) :
      0;
  return value;
}
