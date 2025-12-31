import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://ufkbqwfwniihwbxmguet.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVma2Jxd2Z3bmlpaHdieG1ndWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyOTc2MzYsImV4cCI6MjA3ODg3MzYzNn0.-76htPxf5bRYE64nYV116EwXT4gpBivrcXBDfQM_nrY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
