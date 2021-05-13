/**
 * Contains options for the HTTP helper
 */
export interface HTTPHelperOptions {
    /**
     * The base URI to use.
     * If not specified, uses the base URI of the source the frontend was loaded from.
     */
    baseUri: string;
}