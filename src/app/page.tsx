import Image from "next/image";

export default function Home() {
  return (
    <main className="intro-page">
      <section className="banner-container">
        <div>
          <h1 className="big">welcome to examiq</h1>
          <p className="gray">smarter exams, smarter integrity</p>
        </div>
        <Image
          src={"/images/intro.png"}
          alt="picture of notebook, pencil"
          width={600}
          height={600}
          priority
        />
      </section>
    </main>
  );
}
