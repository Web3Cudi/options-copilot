import { supabase } from "../../utils/supabaseClient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  supabase.auth.api.setAuthCookie(req, res);
}
