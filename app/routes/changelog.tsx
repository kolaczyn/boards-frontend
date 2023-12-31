import type { V2_MetaFunction } from "@remix-run/node";
import { AppLink } from "~/components/ui/AppLink";
import { AppContainer } from "~/components/layout/AppContainer";

type ChangelogItem = {
  version: `${0 | 1}.${number}.${number}`;
  date: `${number}.${number}.${2023}`;
  changes: string;
};

const changelog: ChangelogItem[] = [
  {
    version: "1.4.0",
    date: "16.08.2023",
    changes: "add tripcode",
  },
  {
    version: "1.3.0",
    date: "16.08.2023",
    changes: "small redesign of /changelog page",
  },
  {
    version: "1.2.0",
    date: "15.08.2023",
    changes: "add link for feature requests. Show footer on most pages",
  },
  {
    version: "1.1.1",
    date: "15.08.2023",
    changes: "a line is no longer greentext if it starts with >>",
  },
  {
    version: "1.1.0",
    date: "15.08.2023",
    changes: "more boards. Boards are grouped into categories",
  },
  {
    version: "1.0.0",
    date: "15.08.2023",
    changes:
      "rename website to 'boards' and host it on https://boards.kolaczyn.com",
  },
  {
    version: "0.29.2",
    date: "15.08.2023",
    changes: "always show scrollbar to minimize layout shifts",
  },
  {
    version: "0.29.1",
    date: "15.08.2023",
    changes:
      "correctly display text with line breaks. Make greentext span the whole line",
  },
  {
    version: "0.29.0",
    date: "08.08.2023",
    changes: "show YouTube video preview by hovering over [embed]",
  },
  {
    version: "0.28.0",
    date: "07.08.2023",
    changes: "add /about page",
  },
  {
    version: "0.27.0",
    date: "07.08.2023",
    changes: "breadcrumbs for improved navigation",
  },
  {
    version: "0.26.1",
    date: "07.08.2023",
    changes: "fix not auto filling reply id when replying to a post",
  },
  {
    version: "0.26.0",
    date: "06.08.2023",
    changes: "show post preview when creating a post to a thread",
  },
  {
    version: "0.0.25",
    date: "06.08.2023",
    changes: "show validation errors when creating a post",
  },
  {
    version: "0.24.0",
    date: "05.08.2023",
    changes: "add fullscreen on youtube, and make the video occupy full width",
  },
  {
    version: "0.23.0",
    date: "05.08.2023",
    changes: "redesign posts",
  },
  {
    version: "0.22.0",
    date: "05.08.2023",
    changes: "under the code improvement - deployment automation",
  },
  {
    version: "0.21.0",
    date: "05.08.2023",
    changes: "allow images in replies",
  },
  {
    version: "0.20.0",
    date: "05.08.2023",
    changes: "improve loading speed by moving services closer together",
  },
  {
    version: "0.19.0",
    date: "05.08.2023",
    changes: "under the hood code improvements - no new features",
  },
  {
    version: "0.18.0",
    date: "04.08.2023",
    changes: "add reply by clicking on post number or writing e.g. >>1234",
  },
  {
    version: "0.17.0",
    date: "04.08.2023",
    changes: "fix sort resetting after changing page",
  },
  {
    version: "0.16.0",
    date: "04.08.2023",
    changes: "add RSS feed for all boards' thread and threads' replies",
  },
  {
    version: "0.16.0",
    date: "04.08.2023",
    changes: "add RSS feed (/a/ only)",
  },
  {
    version: "0.15.0",
    date: "03.08.2023",
    changes: "make the background color a subtle gradient",
  },
  {
    version: "0.14.0",
    date: "03.08.2023",
    changes:
      "add refresh button to replies and show loading indicator on replies",
  },
  {
    version: "0.13.0",
    date: "03.08.2023",
    changes: "allow bold (for one word only)",
  },
  {
    version: "0.12.0",
    date: "03.08.2023",
    changes: "allow to show or hide youtube videos embed and show reply id",
  },
  {
    version: "0.12.0",
    date: "03.08.2023",
    changes: "embed youtube videos",
  },
  {
    version: "0.11.0",
    date: "03.08.2023",
    changes:
      "add images (only one per thread). Fix crashing if title is not provided",
  },
  {
    version: "0.10.0",
    date: "03.08.2023",
    changes: "add titles for threads",
  },
  {
    version: "0.9.0",
    date: "02.08.2023",
    changes: "urls in replies are now clickable",
  },
  {
    version: "0.8.0",
    date: "02.08.2023",
    changes: "make the website look slightly better",
  },
  {
    version: "0.7.0",
    date: "02.08.2023",
    changes: "add sort by bump order",
  },
  {
    version: "0.6.0",
    date: "02.08.2023",
    changes:
      "add sort by creation date and reply count and show loading indicator",
  },
  {
    version: "0.5.0",
    date: "01.08.2023",
    changes: "add greentext",
  },
  {
    version: "0.4.0",
    date: "01.08.2023",
    changes: "creating boards no longer public",
  },
  {
    version: "0.3.0",
    date: "01.08.2023",
    changes: "added pagination for threads of a board",
  },
  {
    version: "0.2.0",
    date: "01.08.2023",
    changes: "i accidentally skipped this version, so lol",
  },
  {
    version: "0.1.0",
    date: "31.07.2023",
    changes: "added dates",
  },
  {
    version: "0.0.0",
    date: "30.07.2023",
    changes:
      "initial version: added boards, threads and replies with text only",
  },
];

const ChangelogPage = () => (
  <AppContainer>
    <div className="space-x-3 flex mb-3 items-center font-bold">
      <div className="text-2xl">
        <AppLink href="/">Boards</AppLink>
      </div>
      <div className="text-xl">›</div>
      <div>Changelog</div>
    </div>
    <table className="border border-black">
      <thead className="bg-gray-50 bg-opacity-40">
        <tr>
          <th className="pl-2">Version</th>
          <th className="px-2">Date</th>
          <th className="pr-2">Changes</th>
        </tr>
      </thead>
      <tbody>
        {changelog.map((x) => (
          <tr key={x.version}>
            <td className="pl-2">{x.version}</td>
            <td className="px-2">{x.date.replace(".2023", "")}</td>
            <td className="pr-2">{x.changes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </AppContainer>
);

export const meta: V2_MetaFunction = () => [
  {
    title: "Boards | Changelog",
  },
];

export default ChangelogPage;
