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