import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { readCurrentUser } from "./utils/default/readEntities";

export default async function Home() {
  const { currentUser, currentUserError } = await readCurrentUser();

  if (currentUser?.user || currentUserError) {
    redirect("/dashboard");
  }

  return (
    <main className="intro-page">
      <Link href={"/signin?user=teacher"}>
        <h1>teacher</h1>
        <Image
          src={"/images/teacher.png"}
          alt="intro"
          width={200}
          height={200}
        />
      </Link>

      <Link href={"/signin?user=student"}>
        <h1>student</h1>
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
