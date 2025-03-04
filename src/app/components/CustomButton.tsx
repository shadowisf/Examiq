type CustomButtonProps = {
  children: string;
  onClick: () => void;
};

export default function CustomButton({ children, onClick }: CustomButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
