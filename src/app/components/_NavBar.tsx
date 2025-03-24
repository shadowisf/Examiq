import Link from "next/link";
import { readCurrentUser } from "../utils/default/actions";
import Image from "next/image";

export default async function NavBar() {
  const { currentUser, currentUserError } = await readCurrentUser();

  return (
    <nav>
      <Link
        href={currentUserError || !currentUser.user ? "/" : "/dashboard"}
        className="logo"
      >
        <Image src={"/icons/logo.png"} alt="logo" width={50} height={30} />
        <span>examiq</span>
      </Link>

      <section className="nav-links">
        {currentUserError || !currentUser.user ? (
          <Link href="/">home</Link>
        ) : (
          <Link href="/dashboard">dashboard</Link>
        )}

        {currentUserError || !currentUser.user ? null : (
          <Link href="/signout">sign out</Link>
        )}
      </section>
    </nav>
  );
}
