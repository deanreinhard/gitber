import { Owner } from "./owner";
/* Repository Modal */
export class Repo {
  name?: string;
  created_at?: string;
  clone_url?: string;
  language?: string;
  size?: string;
  owner?: Owner;
  readmeFile?: string;
}
