import { ColumnDef } from "@tanstack/react-table";

export interface Club {
  id: string;
  name: string;
  phone: string;
  fax: string;
  email: string;
  membersCount: number;
  photo_url: string;
}
export type ColumnDefE<T> = ColumnDef<T> & {
  accessorKey?: keyof T;
};
export interface Interpellation {
  id: number;
  title: string;
  member: number;
  bodyLink: string;
  sentDate: string;
}

export interface Envoy {
  id: number;
  firstName: string;
  lastName: string;
  educationLevel: string;
  numberOfVotes: number;
  photo: string;
  active: boolean;
  club: string;
  club_photo: string;
}

export interface ActDirective {
  [key: string]: number;
}

export interface Act {
  ELI: string;
  address: string;
  announcementDate: string;
  changeDate: string;
  displayAddress: string;
  pos: number;
  publisher: string;
  status: string;
  textHTML: boolean;
  textPDF: boolean;
  title: string;
  type: string;
  volume: number;
  year: number;
  directives: ActDirective;
  entryIntoForce: string;
  inForce: string;
  keywords: string[];
  releasedBy: string;
  url: string;
}

export interface Committee {
  name: string;
  nameGenitive: string;
  code: string;
  appointmentDate: string;
  compositionDate: string;
  phone: string;
  scope: string;
  type: string;
}
