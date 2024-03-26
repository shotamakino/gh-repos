interface DateCellProps {
  date: Date | string;
}

export default function DateCell(props: DateCellProps) {
  let datetime;
  if (typeof props.date === "string") {
    datetime = new Date(props.date);
  } else {
    datetime = props.date;
  }

  const date = datetime.toLocaleDateString("us-EN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const time = datetime.toLocaleTimeString("us-EN");

  return (
    <div className="flex-col space-y-2 text-xs">
      <div>{date}</div>
      {time ? <div className="text-slate-300">{time}</div> : null}
    </div>
  );
}
