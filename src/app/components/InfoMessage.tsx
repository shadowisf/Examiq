type InfoMessageProps = {
  children: string;
};

export default function InfoMessage({ children }: InfoMessageProps) {
  return <p className="gray">{children}</p>;
}
