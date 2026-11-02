import {TypographySmall} from "@/shadcn/typography/typography-small";

export function LimitHint() {
  return (
    <TypographySmall>
      <i>
        Counter starts over from 0 after reaching the limit. Give it in following format:{" "}
        <b className="text-green-500">8</b>. Values like <b className="text-destructive">8.5</b> or{" "}
        <b className="text-destructive">8,5</b> aren't allowed.
      </i>
    </TypographySmall>
  );
}
