import { SpoolIcon } from "lucide-react";

export function Logo() {
  return (
    <div className="flex flex-row gap-3 items-center w-fit h-fit px-3">
      <span className="text-xl font-bold text-red-500 pink:text-pink-500">Row counter</span>
      <SpoolIcon className="text-red-500 pink:text-pink-500" />
    </div>
  );
}
