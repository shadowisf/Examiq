import Link from "next/link";
import { createClient } from "../utils/supabase/server";

export default async function NavBar() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  return (
    <nav>
      <Link className="logo" href={"/"}>
        examiq
      </Link>

      <section className="nav-links">
        {error || !data?.user ? "" : <Link href="/teacher-dashboard">dashboard</Link>}

        {error || !data?.user ? (
          <Link href="/signin">sign in</Link>
        ) : (
          <Link href="/signout">sign out</Link>
        )}
      </section>
    </nav>
  );
}
