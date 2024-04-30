import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Button } from "@mui/base";

const API_URL = "http://10.199.4.134/api/v1/message_no_stream";
const textDecoder = new TextDecoder("utf-8");

const TestComp = ({ messages, userMessage }) => {
  const [text, setText] = useState("Sending request...");
  const [sources, setSources] = useState([]);

  const clickHandle = async () => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...messages, userMessage],
      }),
    });

    const streamer = response.body.getReader();

    let unfinished_piece = "";

    let value, chunk, done, splitChunk;
    ({ value } = await streamer.read());
    chunk = textDecoder.decode(value);
    console.log(chunk);

    splitChunk = chunk.split('"START_LLM_RESPONSE"');

    setSources(JSON.parse(splitChunk[0]));

    unfinished_piece = splitChunk[1];

    while (!done) {
      ({ value, done } = await streamer.read());
      chunk = textDecoder.decode(value);
      chunk = unfinished_piece + chunk;

      let deltaText = "";
      for (const line of chunk.split("\n")) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine === "data: [DONE]") {
          continue;
        }

        let obj;
        const json = trimmedLine.replace("data: ", "");
        try {
          obj = JSON.parse(json);
        } catch (e) {
          unfinished_piece = json;
          break;
        }
        const content = _.toString(_.get(obj, "choices.0.text"));
        deltaText = deltaText.concat(content);
        console.log(deltaText);
      }
      setText((prev) => prev.concat(deltaText));
    }
  };

  return (
    <div>
      {text}
      <Button onClick={(e) => clickHandle()}></Button>
    </div>
  );
};

export default TestComp;
