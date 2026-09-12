export interface Scholar {
  id: string;
  name: string;
  title?: string;
  country: string;
  /** Profile image URL; falls back to the scholar's initials when omitted. */
  avatar?: string;
}
