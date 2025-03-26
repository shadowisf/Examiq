type InfoMessageProps = {
  children: any | any[];
};

export default function InfoMessage({ children }: InfoMessageProps) {
  return <p className="gray">{children}</p>;
}
