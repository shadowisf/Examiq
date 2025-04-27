import InfoMessage from "./InfoMessage";

export default function Blocked() {
  return (
    <div className="blocked-page">
      <main>
        <h1 className="big">you have been blocked</h1>
        <br />
        <InfoMessage>
          it seems you are out of focus or left the exam please return to the
          exam page to continue as any further interruption can invalidate your
          exam.
        </InfoMessage>
      </main>
    </div>
  );
}
