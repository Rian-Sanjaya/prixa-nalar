import { CSSProperties } from 'react';

export interface ConversationProps {
  header?: string;
  information?: string | null;
  title: Array<string>;
  subtitle?: string;
  subtitleStyle?: CSSProperties;
  isSubtitleLong?: boolean;
  imgSrc?: string;
  loading?: boolean;
  options: Option[];
  callFunction?: Function;
  search?: string;
  setSearchQuery?: any;
  state?: string;
  sessionId?: string;
  symptomID?: string | null;
}

export interface PreconReply {
  id?: string;
  ageMonth?: number;
  ageYear?: number;
  height?: number;
  width?: number;
  type: string;
  preconditionsDescription?: string;
}

export interface Option {
  type: string;
  text: string;
  link?: string;
  size?: 'base' | 'full' | undefined;
  reply?: {
    type?: string;
    value?: any;
    tag?: string;
    list?: string;
    precondition?: Array<PreconReply>;
  };
  variant: 'default' | 'outline' | 'primary' | 'disabled' | 'secondary' | 'success' | undefined;
}
