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
  member: number;
  sentDate: string;
}


export interface Envoy {
    
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
