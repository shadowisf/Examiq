import Link from "next/link";

export default function NavBar() {
  return (
    <nav>
      <Link className="logo" href={"/"}>
        examiq
      </Link>
      <Link href={"/login"}>login</Link>
    </nav>
  );
}
