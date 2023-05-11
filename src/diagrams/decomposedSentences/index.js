import "babel-polyfill";
import React from "react";
import { useRef, useEffect, useState } from "react";
import lodash, { range, throttle, sortBy } from "lodash";
import { hcl } from "d3-color";
import { maxIndex } from "d3-array";

let exitHoverTimeout = null;
export default () => {
  const [index, setIndex] = useState(0);
  const [clickTokenIndex, setClickTokenIndex] = useState(null);
  const [hoverTokenIndex, setHoverTokenIndex] = useState(null);
  const [allExplanations, setAllExplanations] = useState(null);
  const [tokensJSON, setTokensJSON] = useState(null);
  const [allNmfData, setAllNmfData] = useState(null);
  const nmfColorCount = 3;

  useEffect(() => {
    const onLoadData = async () => {
      const names = ["kitkat", "vaccine", "spacemanandy", "leprechaun"];
      const active = index;

      const path = "./data/neuron-explanations-compressed.json";
      const neuronInfo = await fetch(path).then((res) => res.json());
      setAllExplanations(neuronInfo);

      const tokensJSONPath = `./data/neurons-${names[active]}.json`;
      const _tokensJSON = await fetch(tokensJSONPath).then((res) => res.json());
      setTokensJSON(_tokensJSON);

      const nmfPath = `./data/nmf-${names[active]}.json`;
      const _nmfData = await fetch(nmfPath).then((res) => res.json());
      setAllNmfData(_nmfData);
    };

    onLoadData();
  }, [index]);

  let activeTokenIndex = clickTokenIndex;
  if (hoverTokenIndex !== null) {
    activeTokenIndex = hoverTokenIndex;
  }
  const nmfData =
    activeTokenIndex !== null && allNmfData && allNmfData[activeTokenIndex];
  const nmfColors = nmfData && nmfData["neuron_to_factors"];
  const nmfClusterLabels = nmfData && nmfData["clusters"];
  const allLayers = range(0, 48);

  const layers = [];
  if (activeTokenIndex !== null) {
    for (const layer of allLayers) {
      if (tokensJSON) {
        layers.push(
          tokensJSON.token_by_layer_by_neuron_index_list[activeTokenIndex][
            layer
          ]
        );
      }
    }
  }

  const onClick = async (index) => {
    setClickTokenIndex(index);
  };

  const changeIndex = async (index) => {
    setHoverTokenIndex(null);
    setClickTokenIndex(null);
    setIndex(index);
  };

  const setHoverThrottle = throttle(setHoverTokenIndex);

  const width =
    window.innerWidth -
    document.querySelector("d-article-contents").getBoundingClientRect().left;

  const showableLayers = layers.filter((neurons) => {
    const usableNeurons = (neurons || [])
      .filter((neuron) => allExplanations[neuron][3] > 0.4)
      .slice(0, 9);

    return usableNeurons.length > 0;
  });

  return (
    <figure
      style={{
        borderTop: `1px solid rgba(0, 0, 0, 0.1)`,
        borderBottom: `1px solid rgba(0, 0, 0, 0.1)`,
        overflow: "visible",
        background: `rgb(252, 252, 252)`,
        paddingBottom: 20,
        marginTop: 40,
        marginLeft: -32,
        width,
        paddingLeft: 32,
        paddingTop: 20,
      }}
    >
      {false && (
        <div>
          <input
            type="range"
            min="0"
            max="3"
            value={index}
            onChange={(e) => setIndex(+e.target.value)}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          width: 704,
          flexFlow: "row",
          marginBottom: 13,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            marginTop: 3,
            display: "flex",
            flexFlow: "row",
            marginBottom: 5,
          }}
        >
          <button
            style={{ marginRight: 10 }}
            disabled={index === 0}
            onClick={() => {
              if (index > 0) {
                changeIndex(index - 1);
              }
            }}
          >
            ←
          </button>

          <div style={{ fontSize: 14, fontWeight: 600 }}>
            Example {index + 1} of 4
          </div>

          <button
            style={{ marginLeft: 10 }}
            disabled={index >= 3}
            onClick={() => {
              if (index < 3) {
                changeIndex(index + 1);
              }
            }}
          >
            →
          </button>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        {clickTokenIndex !== null && (
          <button
            style={{
              position: "absolute",
              top: 2,
              left: 705,
            }}
            onClick={() => setClickTokenIndex(null)}
          >
            Clear Selection
          </button>
        )}
        {activeTokenIndex === null && (
          <div
            style={{
              position: "absolute",
              top: 2,
              left: 705,
              display: "flex",
              flextFlow: "row",
              alignItems: "center",
            }}
          >
            <img
              style={{
                width: 33,
                height: 33,
              }}
              width={33}
              height={33}
              src="data:image/png;base64,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"
            />
            <span
              style={{
                width: 121,
                fontSize: 12,
                marginLeft: 3,
                display: "block",
                fontWeight: 400,
                lineHeight: 1.3,
                userSelect: "none",
              }}
            >
              Click a token to see which neurons fire
            </span>
          </div>
        )}
        <div
          style={{
            display: "block",
            width: 704,
            lineHeight: 1.6,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {tokensJSON &&
            tokensJSON.sentence_tokens_as_strings.map((token, index) => {
              const startsWithBlank = token.startsWith(" ");
              if (startsWithBlank) {
                token = token.slice(1);
              }

              return (
                <>
                  {startsWithBlank && <span> </span>}
                  <span
                    onMouseEnter={() => {
                      if (clickTokenIndex !== null) {
                        return;
                      }
                      if (exitHoverTimeout) {
                        clearTimeout(exitHoverTimeout);
                      }
                      exitHoverTimeout = null;
                      setHoverTokenIndex(index);
                    }}
                    onMouseLeave={() => {
                      exitHoverTimeout = setTimeout(() => {
                        setHoverTokenIndex(null);
                      }, 400);
                    }}
                    onMouseDown={() => {
                      if (clickTokenIndex === index) {
                        setClickTokenIndex(null);
                      } else {
                        onClick(index);
                      }
                    }}
                    style={{
                      userSelect: "none",
                      background:
                        activeTokenIndex === index
                          ? `rgba(255, 208, 89, 0.3)`
                          : `rgba(0,0,0,0)`,
                      borderBottom: `2px solid ${
                        activeTokenIndex === index && clickTokenIndex === index
                          ? `rgba(255, 102, 0, 0.7)`
                          : `rgba(0,0,0,0)`
                      }`,
                      opacity: activeTokenIndex === index ? 1 : 0.8,
                    }}
                  >
                    {token}
                  </span>
                </>
              );
            })}
        </div>
      </div>
      {nmfColors && (
        <div
          style={{
            width: 704,
            display: "flex",
            justifyContent: "center",
            flexFlow: "row",
            marginTop: 15,
            marginBottom: 15,
          }}
        >
          <div
            style={{
              background: "rgba(0, 0, 0, 0.1)",
              height: 1,
              width: 704,
            }}
          />
        </div>
      )}

      <div
        style={{
          marginLeft: 5,
          marginBottom: 8,
          marginTop: 15,
          // display: "flex",
          // flexFlow: "row",
        }}
      >
        {nmfColors &&
          range(nmfColorCount).map((colorIndex) => {
            const hue = (360 / nmfColorCount) * colorIndex - 80;
            const totalCount = Object.values(nmfColors).filter(
              (xs) => xs.indexOf(Math.max(...xs)) === colorIndex
            ).length;
            return (
              <div
                style={{
                  marginLeft: 5,
                  alignItems: "center",
                  marginRight: 5,
                  display: "flex",
                  flexFlow: "row",
                  margin: 1,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    background: hcl(hue, 70, 70).toString(),
                    opacity: 0.8,
                    margin: 3,
                    borderRadius: 3,
                  }}
                />
                <span style={{ fontWeight: 600, marginLeft: 5, fontSize: 14 }}>
                  {nmfClusterLabels[colorIndex]} ({totalCount})
                </span>
              </div>
            );
          })}
      </div>
      <div
        style={{
          display: "block",
          overflowX: "scroll",
          paddingLeft: 32,
          marginLeft: -32,
        }}
      >
        <div
          style={{
            display: "flex",
            flexFlow: "row",
            width: "max-content",
            paddingRight: 30,
          }}
        >
          {showableLayers.map((neurons, layer) => {
            const usableNeurons = (neurons || [])
              .filter((neuron) => allExplanations[neuron][3] > 0.4)
              .slice(0, 8);
            return (
              <div
                style={{
                  border: `1px solid rgba(0, 0, 0, 0.1)`,
                  padding: 5,
                  width: 300,
                  background: "white",
                  display: "block",
                  borderRadius: 5,
                  margin: 3,
                }}
              >
                <h4 style={{ padding: 0, margin: 0 }}>layer {layer}</h4>
                {sortBy(usableNeurons, (neuron, index) => {
                  const [layer, neuronIndex, explanation, score] =
                    allExplanations[neuron];
                  const nmfColorId = `${layer}:${neuronIndex}`;
                  return maxIndex(nmfColors[nmfColorId]);
                }).map((neuron, index) => {
                  const [layer, neuronIndex, explanation, score] =
                    allExplanations[neuron];
                  const nmfColorId = `${layer}:${neuronIndex}`;
                  return (
                    <div>
                      <div
                        style={{
                          paddingTop: 2,
                          paddingBottom: 2,
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        <span
                          style={{
                            position: "relative",
                            width: 15,
                            height: 15,
                            margin: 2,
                          }}
                        >
                          {nmfColors &&
                            nmfColors[nmfColorId] &&
                            (() => {
                              const colorIndex = maxIndex(
                                nmfColors[nmfColorId]
                              );
                              const hue =
                                (360 / nmfColorCount) * colorIndex - 80;
                              return (
                                <div
                                  style={{
                                    width: 12,
                                    height: 12,
                                    position: "absolute",
                                    top: 3,
                                    background: hcl(hue, 70, 70).toString(),
                                    opacity: 0.8,
                                    // opacity:
                                    // nmfColors[nmfColorId][colorIndex] /
                                    // sum(nmfColors[nmfColorId]),
                                    borderRadius: 5,
                                  }}
                                />
                              );
                            })()}
                        </span>
                        <a
                          style={{ marginLeft: 16 }}
                          target={"_blank"}
                          href={`https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/${layer}/neurons/${neuronIndex}`}
                        >
                          {neuronIndex}
                        </a>
                        : <b>{explanation}</b> {score}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      {nmfColors && (
        <figcaption
          style={{
            marginTop: 15,
            width: 704,
            alignSelf: "center",
            display: "block",
          }}
        >
          We generated cluster labels by embedding each neuron explanation using
          the OpenAI Embeddings API, then clustering them and asking GPT-4 to
          label each cluster.
        </figcaption>
      )}
    </figure>
  );
};
