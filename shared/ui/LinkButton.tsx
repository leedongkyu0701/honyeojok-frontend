import type { ComponentProps } from "react";
import Link from "next/link";
import { buttonStyles, type ButtonStyleProps } from "./Button";

export default function LinkButton({
  className,
  variant,
  size,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}
