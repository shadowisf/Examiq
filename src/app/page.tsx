import Link from "next/link";
import { readCurrentUser } from "./utils/default/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const { currentUser } = await readCurrentUser();

  if (currentUser.user) {
    redirect("/dashboard");
  }

  return (
    <main className="intro-page">
      <Link href={"/signin?user=student"}>
        <h1>students</h1>
      </Link>

      <Link href={"/signin?user=teacher"}>
        <h1>teachers</h1>
      </Link>

      <Link href={"/signin?user=admin"}>
        <h1>admin</h1>
      </Link>
    </main>
  );
}
