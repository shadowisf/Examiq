import Link from "next/link";
import { readCurrentUser } from "./utils/default/actions";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Home() {
  const { currentUser } = await readCurrentUser();

  if (currentUser.user) {
    redirect("/dashboard");
  }

  return (
    <main className="intro-page">
      <Link href={"/signin?user=teacher"}>
        <h1>teachers</h1>
        <Image
          src={"/images/teacher.png"}
          alt="intro"
          width={200}
          height={200}
        />
      </Link>

      <Link href={"/signin?user=student"}>
        <h1>students</h1>
        <Image
          src={"/images/student.png"}
          alt="intro"
          width={350}
          height={200}
        />
      </Link>

      <Link href={"/signin?user=admin"}>
        <h1>admin</h1>
        <Image src={"/images/admin.png"} alt="intro" width={200} height={200} />
      </Link>
    </main>
  );
}
