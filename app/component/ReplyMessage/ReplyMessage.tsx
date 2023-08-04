import { useEffect, useState } from "react";
import { checkIfIsUrl } from "~/component/ReplyMessage/checkIfIsUrl";
import { convertToEmbeddedUrl } from "~/component/ReplyMessage/convertToEmbeddedUrl";
import { YoutubeEmbed } from "~/component/ReplyMessage/YoutubeEmbed";
import { QuoteTooltip } from "~/component/ReplyMessage/QuoteTooltip";
import { LinkMessage } from "~/component/ReplyMessage/LinkMesage";

type Props = {
  message: string;
};

const ReplyText = ({ text }: { text: string }) => {
  const [replyText, setReplyText] = useState<string | null>(null);
  const isBold = text.startsWith("*") && text.endsWith("*");

  const isQuote = text.startsWith(">>");
  const quoteId = text.replace(">>", "");
  const isGreentext = text.startsWith(">") && !isQuote;

  useEffect(() => {
    const element = document.getElementById(quoteId);
    if (!element) {
      setReplyText("__not__found__");
      return;
    }

    setReplyText(element?.innerText ?? null);
  }, [quoteId]);

  const getColor = () => {
    if (isQuote) return "#d00";
    if (isGreentext) return "#789922";
    return "";
  };

  if (!isQuote) {
    return (
      <span style={{ color: getColor() }} className={isBold ? "font-bold" : ""}>
        {text}{" "}
      </span>
    );
  }

  if (replyText === "__not__found__") {
    return (
      <span
        style={{ color: getColor() }}
        className={[
          isBold ? "font-bold" : "",
          replyText === "__not__found__" ? "line-through" : "",
        ].join(" ")}
      >
        {text}{" "}
      </span>
    );
  }

  return (
    <QuoteTooltip tooltipText={replyText}>
      <span
        onClick={() => {
          document.getElementById(quoteId)?.scrollIntoView();
        }}
        style={{ color: getColor() }}
        className={isBold ? "font-bold" : ""}
      >
        {text}{" "}
      </span>
    </QuoteTooltip>
  );
};

export const ReplyMessage = ({ message }: Props) => {
  const words = message.split(/\s+|\n+/);

  // using idx as key - not perfect but good enough for now
  return words.map((x, idx) => {
    const isUrl = checkIfIsUrl(x);
    const youtubeEmbedded = convertToEmbeddedUrl(x);
    if (youtubeEmbedded) {
      // eslint-disable-next-line react/jsx-no-undef
      return <YoutubeEmbed url={x} embedUrl={youtubeEmbedded} key={idx} />;
    }
    if (isUrl) {
      return <LinkMessage link={x} key={idx} />;
    }

    return <ReplyText text={x} key={idx} />;
  });
};
