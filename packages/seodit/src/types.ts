export type ExpectedValue = string | RegExp;

export type SeoIssueSeverity = "error";

export interface SeoIssue {
  id: string;
  field: string;
  selector?: string;
  severity: SeoIssueSeverity;
  message: string;
  expected?: unknown;
  actual?: unknown;
}

export interface RobotsMetaExpectation {
  index?: boolean;
  follow?: boolean;
}

export interface OpenGraphImageSizeExpectation {
  width?: number | string;
  height?: number | string;
}
