// app/types/types.ts
export type SummaryType = {
    id: number;
    text: string;
    summary: string;
    main_idea: string;
    key_points?: string;
    conclusion?: string;
    tags?: string[];
    format?: string;
    created_at: string;
    is_favorite?: boolean;
  };
  export type UserType = {
    id: number;
    username: string;
    email: string;
    role?: string;
    profile_picture?: string;
    avatar_url?: string;
    banner_url?:string;
  };
  
  
  
  export type AuthContextType = {
    user: UserType | null;
    token: string | null;
    summaries: SummaryType[];
    loading: boolean;
    error: string | null;
    login: (idOrEmail: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>
    deleteSummary: (id: number) => void;
    requireToken: () => string; 
    updateProfilePicture: (file: File) => Promise<void>;
    setSummaries: React.Dispatch<React.SetStateAction<SummaryType[]>>;
  };


