export type URLQueryValueType = number | string | (number | string)[];

export default interface URLQuery {
  [key: string]: URLQueryValueType;
}
