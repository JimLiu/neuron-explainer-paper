import React from "react";

const DEFAULT_COLORS = [
  // { r: 255, g: 0, b: 105 },
  { r: 255, g: 255, b: 255 },
  { r: 0, g: 255, b: 0 },
]
const DEFAULT_BOUNDARIES = [
  // 0, 0.5, 1
  0, 1
]

function interpolateColor(color_l, color_r, value) {
  const color = {
    r: Math.round(color_l.r + (color_r.r - color_l.r) * value),
    g: Math.round(color_l.g + (color_r.g - color_l.g) * value),
    b: Math.round(color_l.b + (color_r.b - color_l.b) * value),
  }
  return color
}

function getInterpolatedColor(colors, boundaries, value) {
  const index = boundaries.findIndex((boundary) => boundary >= value)
  const colorIndex = Math.max(0, index - 1)
  const color_left = colors[colorIndex]
  const color_right = colors[colorIndex + 1]
  const boundary_left = boundaries[colorIndex ]
  const boundary_right = boundaries[colorIndex + 1]
  const ratio = (value - boundary_left) / (boundary_right - boundary_left)
  const color = interpolateColor(color_left, color_right, ratio)
  return color
}

export function TokenHeatmap({ tokens, animate = false, colors = DEFAULT_COLORS, boundaries = DEFAULT_BOUNDARIES }) {
  const [animating, setAnimating] = React.useState(false);
  if (animate && !animating) {
    setTimeout(() => {
      setAnimating(true);
    }, 25);
  }
  const stagger_delay = 25;

  const text = tokens.map(({token}) => token).join('')
  return (
    <>
    <div key={text} className="block" style={{width:'100%', fontSize: 'small', padding: '5px', lineHeight: '1.1em'}}>
      {tokens.map(({ token, strength, normalized_strength }, i) => {
        const color = getInterpolatedColor(colors, boundaries, normalized_strength || strength);
        return <span key={i}
          title={null ? `Activation: ${strength.toFixed(2)}`: null}
          style={{
            transition: animating ? `background-color ${stagger_delay}ms ease-in ${stagger_delay*i}ms, color ${stagger_delay}ms ease-in ${stagger_delay*i-stagger_delay/2}ms` : '',
            background: (!animate || animating) ? `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)` : '',
            color: (!animate || animating) ? `black` : 'white',
          }}
        >
          {token}
        </span>
      })}
    </div>
    </>
  )
}

export function SimulationSequences({ sequences, simulated_sequences, overlay_activations, colors = DEFAULT_COLORS, boundaries = DEFAULT_BOUNDARIES }) {
  if (overlay_activations) {
    return <>
      {
        sequences.map((tokens, i) => {
          let simulated_tokens = simulated_sequences[i];
          return (
            <div style={{ width: '100%', /*,whiteSpace: 'nowrap', overflowX: 'auto' */ }} key={i}>
              {tokens.map(({ token, strength, normalized_strength }, j) => {
                const { token: simulated_token, strength: simulated_strength, normalized_strength: simulated_normalized_strength } = simulated_tokens[j];
                if (simulated_token !== token) {
                  throw new Error('simulated tokens not matching')
                }
                const color = getInterpolatedColor(colors, boundaries, normalized_strength || strength);
                const simcolor = getInterpolatedColor(colors, boundaries, simulated_normalized_strength || simulated_strength);

                return <div style={{ display: 'inline-block', whiteSpace: 'pre' }} key={j}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                      title={`Activation: ${strength.toFixed(2)}`}
                      style={{
                        fontSize: 'small' ,
                        // transition: "500ms ease-in all",
                        background: `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`,
                      }}
                    >{token}</span>
                    <span
                      title={`Simulation: ${simulated_strength.toFixed(2)}`}
                      style={{
                        // transition: "500ms ease-in all",
                        background: `rgba(${simcolor.r}, ${simcolor.g}, ${simcolor.b}, 0.5)`,
                      }}
                    >{token}</span>
                  </div>
                </div>
              })}
            </div>
          )
      })
    }
    </>
  }
  return <div style={{ width: '100%', display: 'flex', flexDirection: 'row'}}>
      <div style={{flexBasis: 0, flexGrow: 1}}>
                <div
                  style={{
                    fontSize: '0.7em',
                    fontWeight: 'bold',
                  }}
                >Real activations:</div>
        {
          sequences.map((tokens, i) => 
            <div style={{ width: '100%', lineHeight: '1.1em', margin: '5px 0px'}} key={i}>
              {tokens.map(({ token, strength, normalized_strength }, j) => {
                const color = getInterpolatedColor(colors, boundaries, normalized_strength || strength);
                return <span key={j}
                  title={`Activation: ${strength.toFixed(2)}`}
                  style={{
                    fontSize: 'small' ,
                    // transition: "500ms ease-in all",
                    background: `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`,
                  }}
                >{token}</span>
              })}
            </div>
          )
        }
      </div>
      <div style={{flexBasis: 0, flexGrow: 1}}>
                <div
                  style={{
                    fontSize: '0.7em',
                    fontWeight: 'bold',
                  }}
                >Simulated activations:</div>
        {
          simulated_sequences.map((simulated_tokens, i) => 
            <div style={{ width: '100%', lineHeight: '1.1em', margin: '5px 0px'}} key={i}>
              {simulated_tokens.map(({ token, strength, normalized_strength }, j) => {
                const color = getInterpolatedColor(colors, boundaries, normalized_strength || strength);
                return <span key={j}
                  title={`Activation: ${strength.toFixed(2)}`}
                  style={{
                    fontSize: 'small' ,
                    // transition: "500ms ease-in all",
                    background: `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`,
                  }}
                >{token}</span>
              })}
            </div>
          )
        }
      </div>
    </div>
}


