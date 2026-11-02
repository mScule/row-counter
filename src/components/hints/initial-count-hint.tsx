import {TypographySmall} from "@/shadcn/typography/typography-small";

export function InitialCountHint() {
  return (
    <TypographySmall>
      <i>
        Leave empty to start from <b className="text-green-500">0</b>. Values like{" "}
        <b className="text-destructive">12.5</b> or <b className="text-destructive">-1</b> aren't allowed.
      </i>
    </TypographySmall>
  );
}
