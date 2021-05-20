export default interface SearchResultList {
  key: number | string;
  header: string;
  elements: { key: number | string; element: JSX.Element }[];
}
