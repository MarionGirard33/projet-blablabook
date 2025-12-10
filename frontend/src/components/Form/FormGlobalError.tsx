type FormGlobalErrorProps = {
  message: string;
}

export default function FormGlobalError({ message }: FormGlobalErrorProps) {
  return (
    <div className="font-bold text-red-500">
      {message}
    </div>
  )
}
