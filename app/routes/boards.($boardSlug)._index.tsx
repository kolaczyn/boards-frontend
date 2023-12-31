import { API_URL_V1 } from "~/constants";
import type {
  ActionArgs,
  DataFunctionArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSearchParams,
  useActionData,
} from "@remix-run/react";
import type {
  BoardsThreadsDto,
  BoardsThreadsQueryDto,
  SortOrderDto,
} from "~/types";
import type { SyntheticEvent } from "react";
import { getIsJannyFromCookie } from "~/utils/getIsJannyFromCookie";
import { toQueryString } from "~/utils/toQueryString";
import { useState } from "react";
import { redirect } from "@remix-run/node";
import { AppContainer } from "~/components/layout/AppContainer";
import { SortOptions } from "~/components/boardsThreads/SortOptions";
import { Pagination } from "~/components/boardsThreads/Pagination";
import { ThreadTeaser } from "~/components/boardsThreads/ThreadTeaser";
import { AppLink } from "~/components/ui/AppLink";
import { AppLinkExternal } from "~/components/ui/AppLinkExternal";
import { Loader } from "~/components/ui/Loader";
import { urlPattern } from "~/utils/urlPattern";
import { isTripcodeValid } from "~/utils/isTripcodeValid";

const PAGE_SIZE = 24;
const DEFAULT_SORT: SortOrderDto = "bump";

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const boardSlug = params.boardSlug;
  if (!boardSlug) {
    return;
  }

  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get("page") ?? "1";
  const sortOrder = searchParams.get("sortOrder") ?? DEFAULT_SORT;

  const isJanny = await getIsJannyFromCookie(request);
  const query: BoardsThreadsQueryDto = {
    slug: boardSlug,
    page: Number(page),
    pageSize: Number(PAGE_SIZE),
    sortOrder,
  };
  const res: BoardsThreadsDto = await fetch(
    `${API_URL_V1}/${boardSlug}?${toQueryString(query)}`
  ).then((res) => res.json());
  return { isJanny, boardsThreads: res };
};

type FormValidationErrors = {
  message: string | null;
  title: string | null;
  imageUrl: string | null;
};

export const action = async ({ request, params }: ActionArgs) => {
  const formData = await request.formData();
  const message = formData.get("message") ?? "";
  const title = formData.get("title") ?? "";
  const imageUrl = formData.get("image-url") ?? "";
  const tripcode = formData.get("tripcode") ?? "";

  let errs: FormValidationErrors = {
    message: null,
    title: null,
    imageUrl: null,
  };

  if (message === "") {
    errs.message = "Message can't be empty";
  }
  if (title === "") {
    errs.title = "Title can't be empty";
  }
  if (!urlPattern.test(imageUrl as string)) {
    errs.imageUrl = "Image URL is not valid";
  }
  if (imageUrl === "") {
    errs.imageUrl = "Image can't be empty when creating a new thread";
  }

  if (errs.message || errs.title || errs.imageUrl) {
    return new Response(JSON.stringify(errs), {
      status: 400,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

  let payload: any = {
    message,
    title,
    imageUrl,
  };
  if (tripcode !== "") {
    payload.tripcode = tripcode;
  }

  const result = await fetch(`${API_URL_V1}/${params.boardSlug}/threads`, {
    method: "post",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  }).then((x) => x.json());

  return redirect(`/boards/${params.boardSlug}/${result.id}`);
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const x = data?.boardsThreads;
  return [
    {
      title: x ? `/${x.slug}/ - ${x.name}` : "",
    },
  ];
};

const BoardPage = () => {
  const actionData = useActionData<FormValidationErrors>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { boardsThreads: data, isJanny } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [imageUrl, setImageUrl] = useState("");
  const [tripcode, setTripcode] = useState("");

  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  const isFirstPage = currentPage === 1;
  const isLastPage = data.threads.length < PAGE_SIZE;
  const sortOrder = searchParams.get("sortOrder") ?? DEFAULT_SORT;

  const handleSelectSort = (e: SyntheticEvent<HTMLSelectElement>) => {
    setSearchParams(
      new URLSearchParams({ page: "1", sortOrder: e.currentTarget.value })
    );
  };

  const handleSetPage = (page: number) => {
    const newSearchParams = new URLSearchParams({
      page: `${page}`,
      sortOrder,
    });
    setSearchParams(newSearchParams);
  };

  const isLoading = navigation.state === "loading";

  return (
    <AppContainer>
      <div className="space-x-3 flex mb-3 items-center font-bold">
        <div className="text-2xl">
          <AppLink href="/">Boards</AppLink>
        </div>
        <div className="text-xl">›</div>
        <h1>/{data.slug}/</h1>
      </div>

      {!!data.threads.length && (
        <>
          <div className="flex justify-between mb-2">
            <h2 className="text-3xl">Threads:</h2>
            <SortOptions handleSelectSort={handleSelectSort} />
          </div>
          <Pagination
            isLastPage={isLastPage}
            currentPage={currentPage}
            handleSetPage={handleSetPage}
            isFirstPage={isFirstPage}
            isLoading={isLoading}
          />

          <ul>
            <Loader isLoading={isLoading}>
              {data.threads.map((x) => (
                <li key={x.id}>
                  <ThreadTeaser {...x} isJanny={isJanny} slug={data.slug} />
                </li>
              ))}
            </Loader>
          </ul>
        </>
      )}
      <hr className="my-3" />
      <AppLinkExternal href={`https://api.kolaczyn.com/${data.slug}`}>
        Rss Feed
      </AppLinkExternal>
      <hr className="mt-3" />

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div>
          <h2 className="font-medium mb-2 text-lg">Start a new thread</h2>
          <Form method="POST">
            <label htmlFor="title" className="font-medium mr-2 block mt-2">
              Title: <span className="text-gray-400 text-sm">(required)</span>
            </label>
            <input
              id="title"
              className="bg-gray-50 my-1 d-block w-full"
              name="title"
            />
            {actionData?.title && (
              <div className="text-red-400 text-sm">{actionData.title}</div>
            )}

            <label htmlFor="image-url" className="font-medium mr-2 block mt-2">
              Image url:{" "}
              <span className="text-gray-400 text-sm">(required)</span>
            </label>
            <input
              id="image-url"
              className="bg-gray-50 my-1 d-block w-full"
              name="image-url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {actionData?.imageUrl && (
              <div className="text-red-400 text-sm">{actionData.imageUrl}</div>
            )}

            <label htmlFor="message" className="font-medium mr-2 block mt-2">
              Message: <span className="text-gray-400 text-sm">(required)</span>
            </label>
            <textarea
              id="message"
              className="bg-gray-50 my-1 w-full"
              name="message"
              rows={3}
            />
            {actionData?.message && (
              <div className="text-red-400 text-sm mt-0.5">
                {actionData.message}
              </div>
            )}

            <label htmlFor="tripcode" className="font-medium mr-2 block mt-2">
              Tripcode:{" "}
              <span className="text-gray-400 text-sm">(optional)</span>
            </label>
            <input
              value={tripcode}
              onChange={(e) => setTripcode(e.target.value)}
              id="tripcode"
              className="bg-gray-50 my-1 d-block w-full"
              name="tripcode"
            />
            <div className="text-gray-400 text-sm">
              Tripcode must follow this format: name#password
            </div>
            {isTripcodeValid(tripcode) && (
              <div className="text-gray-400 text-sm mt-1">
                ✔️ The format is good
              </div>
            )}

            <button
              className="bg-gray-100 hover:bg-gray-200 transition-colors px-2 py-1 cursor-pointer mt-3"
              disabled={navigation.state === "submitting"}
              type="submit"
            >
              Send
            </button>
          </Form>
        </div>
        {imageUrl ? (
          <img
            alt="The image could not be loaded. Make sure the link is okay"
            src={imageUrl}
            className="max-w-xs aspect-auto max-h-40"
          />
        ) : (
          <div />
        )}
      </div>
    </AppContainer>
  );
};

export default BoardPage;
