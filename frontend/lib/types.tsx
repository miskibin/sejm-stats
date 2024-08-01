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


export interface Print {
  id: string;
  title: string;
  pdf_url: string;
}

export interface Voting {
  id: number;
  yes: number;
  no: number;
  abstain: number;
  category: string;
  term: number;
  sitting: number;
  sittingDay: number;
  votingNumber: number;
  date: string;
  title: string;
  description: string;
  topic: string;
  prints: string[];
  kind: string;
  success: boolean;
}

export interface Stage {
  stageNumber: number;
  date: string | null;
  stageName: string;
  sittingNum: number | null;
  comment: string | null;
  decision: string | null;
  textAfter3: string | null;
  voting: Voting | null;
  result: string;
}

export interface Process {
  id: string;
  UE: string;
  comments: string;
  number: number;
  term: number;
  changeDate: string;
  description: string;
  documentDate: string;
  documentType: string;
  legislativeCommittee: string;
  principleOfSubsidiarity: string;
  processStartDate: string;
  rclNum: string;
  title: string;
  urgencyStatus: string;
  createdBy: string;
  pagesCount: number;
  length_tag: string;
  is_finished: string;
  prints: Print[];
  club: string | null;
  MPs: Envoy[];
  stages: Stage[];
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
export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  url1: string | null;
  url2: string | null;
}

export type CommitteeMember = {
  envoy_id: number;
  envoy_name: string;
  envoy_club: string;
  function: string | null;
};

type CommitteeSitting = {
  id: number;
  agenda: string;
  closed: boolean;
  date: string;
  num: number;
  remote: boolean;
  video_url: string | null;
  pdf_transcript: string;
  prints: Array<{
    id: string;
    title: string;
    pdf_url: string;
  }>;
};

export type CommitteeResponse = {
  code: string;
  name: string;
  nameGenitive: string;
  type: string;
  appointmentDate: string;
  composition_date: string;
  phone: string;
  scope: string;
  members: CommitteeMember[];
  recent_sittings: CommitteeSitting[];
};