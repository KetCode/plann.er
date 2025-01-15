export function Loading({ ...rest }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border-[3px] border-t-[3px] border-zinc-950 border-t-lime-300 rounded-full w-6 h-6 animate-spin" {...rest} />
    </div>
  )
}