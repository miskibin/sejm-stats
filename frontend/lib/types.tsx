import { ColumnDef } from "@tanstack/react-table";
export type ColumnDefE<T> = ColumnDef<T> & {
  accessorKey?: keyof T;
};
export interface EnvoyDetail {
  id: number;
  firstName: string;
  secondName: string;
  lastName: string;
  email: string;
  active: boolean;
  districtName: string;
  districtNum: number;
  voivodeship: string;
  club: string;
  birthDate: string;
  birthLocation: string;
  profession: string;
  educationLevel: string;
  numberOfVotes: number;
  biography: string;
  biography_source: string;
  title: string;
  full_name: string;
  photo: string;
  club_photo: string;
  latest_votings: Array<{
    id: number;
    title: string;
    date: string;
    envoy_vote: string;
  }>;
  discipline_ratio: {
    labels: string[];
    values: number[];
    colors: string[];
  };
  committee_memberships: Array<{
    committee_name: string;
    committee_code: string;
    function: string;
  }>;
  processes: Array<{
    id: string;
    number: number;
    documentDate: string;
    title: string;
    createdBy: string;
    length_tag: string;
  }>;
  interpellations: Array<{
    id: number;
    title: string;
    lastModified: string;
    bodyLink: string | null;
  }>;
  activity_percentage: number;
}

export interface APIResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Club {
  id: string;
  name: string;
  phone: string;
  fax: string;
  email: string;
  membersCount: number;
  photo_url: string;
}

export interface Interpellation {
  id: number;
  title: string;
  to: string;
  member: number;
  bodyLink: string;
  sentDate: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  url1: string | null;
  url2: string | null;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  since: string;
  facebook_url: string | null;
  about: string | null;
  photo: string | null;
}
export interface FaqViewAPIResponse {
  faqs: APIResponse<FAQItem>;
  team_members: TeamMember[];
}

export interface MetaItem {
  name: string;
  count: number;
}

export interface ActsMeta {
  publishers: MetaItem[];
  keywords: MetaItem[];
  actStatuses: MetaItem[];
  institutions: MetaItem[];
  years: MetaItem[];
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
  description: string | null;
  topic: string;
  prints: VotingPrint[];
  pdfLink: string | null;
  kind: string;
  success: boolean;
  summary: string;
  club_votes: ClubVote[];
  total_data: number[];
  total_labels: string[];
  sex_votes: SexVotes;
  processes: any[];
  similar_votings: any[];
  votes: Vote[];
}

interface VotingPrint {
  id: string;
  title: string;
  pdf_url: string;
}

interface ClubVote {
  club: {
    id: string;
  };
  yes: number;
  no: number;
  abstain: number;
}

interface SexVotes {
  female: {
    yes: number;
    no: number;
    abstain: number;
  };
  male: {
    yes: number;
    no: number;
    abstain: number;
  };
}

interface Vote {
  MP: string;
  vote: string;
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

export type CommitteeMember = {
  envoy_id: number;
  envoy_name: string;
  envoy_club: string;
  function: string | null;
};

export type CommitteeSitting = {
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

export type ArticleListItem = {
  id: number;
  title: string;
  image: any;
  created_at: string;
  updated_at: string;
  author: string;
};
export type Article = {
  id: number;
  image: any;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: string;
};
