/**
 * Types that are possible for the properties of a neo4j node or relationship
 * TODO Find out which types are possible, see issue #85
 */
export type Property = number | string | Record<string, unknown> | unknown;
