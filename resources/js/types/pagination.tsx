export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export type Pagination<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
  per_page: number;
  from: number | null;
  to: number | null;
  total: number;
  links?: PaginationLink[];
}
