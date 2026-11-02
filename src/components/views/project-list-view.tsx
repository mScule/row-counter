import {ProjectCreationForm} from "@/components/forms/project-creation-form";
import {AppSettingsForm} from "@/components/forms/app-settings-form";
import {ProjectList} from "@/components/lists/project-list";
import {TypographyH2} from "@/shadcn/typography/typography-h2";

export function ProjectListView() {
  return (
    <div className="flex flex-col gap-3 px-2 w-full max-w-2xl">
      <div className="flex flex-row gap-5 justify-between w-full">
        <TypographyH2>Projects</TypographyH2>
        <div className="flex flex-row gap-2 items-center">
          <ProjectCreationForm />
          <AppSettingsForm />
        </div>
      </div>
      <ProjectList />
    </div>
  );
}
