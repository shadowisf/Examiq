import Link from "next/link";
import { readCurrentUser } from "../utils/supabase/server";

export default async function NavBar() {
  const { currentUser, currentUserError } = await readCurrentUser();

  return (
    <nav>
      <Link className="logo" href={"/"}>
        examiq
      </Link>

      <section className="nav-links">
        {currentUserError || !currentUser?.user ? (
          ""
        ) : (
          <Link href="/dashboard">dashboard</Link>
        )}

        {currentUserError || !currentUser?.user ? (
          <Link href="/signin">sign in</Link>
        ) : (
          <Link href="/signout">sign out</Link>
        )}
      </section>
    </nav>
  );
}
