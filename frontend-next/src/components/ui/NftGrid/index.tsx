import { twMerge } from "tailwind-merge";

export default function NftGrid(props: {
  children: JSX.Element[];
  className?: string;
}) {
  const { children } = props;

  const length = children.length;

  const gridClass = `grid-cols-${length}`;

  return (
    <div
      className={twMerge(
        "grid auto-cols-min gap-8 place-content-stretch justify-items-center",
        gridClass,
        length === 1 && "grid-cols-1",
        length > 1 && "grid-cols-2",
        length > 2 && "grid-cols-3",
        length > 3 && "sm:grid-cols-4",
        length > 5 && "lg:grid-cols-6",
        length > 7 && "xl:grid-cols-8",
        props.className
      )}
    >
      {children}
    </div>
  );
}
