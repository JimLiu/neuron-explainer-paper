import React from "react";
import CarouselData from './carousel_neurons.json'
import { TokenHeatmap, SimulationSequences } from '../components/tokenheatmap'


export default ({ }) => {
  // let n = CarouselData.length
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);

  const data = CarouselData[currentIndex]
  const c = ({ disabled, faded }) => {
    return {
      backgroundColor: `rgb(33, 150, 242, ${disabled || faded ? 0.3 : 1})`,
      cursor: disabled ? 'auto' : 'pointer',
    };
  }

  const headingstyle = {
    fontSize: '1.1em',
    // fontWeight: 'bold',
  };
  const spanstyle = {
    color: 'white',
    borderRadius: '10px',
    padding: '5px 10px',
    marginRight: '10px',
  };
  const stepStyle = {
    border: 'rgb(33, 150, 242) 2px solid',
    borderRadius: '10px',
    padding: '10px',
    margin: '10px 0px',
  };
  return (
    <div style={{ padding: '5px' }}>
      <div style={{ position: "relative", alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ marginTop: '5px', marginBottom: '5px' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => setCurrentStep(0)}>
            <span style={{
              ...spanstyle, ...c({ faded: currentStep !== 0 }),
            }}>Step 1</span>
            <span style={headingstyle}><b>Explain</b> the neuron's activations using GPT-4</span>
          </div>

          {currentStep === 0 &&
            <div style={{ ...stepStyle }}>
              Show neuron activations to GPT-4:
              <div style={{ padding: '5px 10px' }}>
                {data.explain_sequences.map((expl_seq, i) => {
                  return <TokenHeatmap key={i} tokens={expl_seq.actual} />
                })}
              </div>
              GPT-4 gives an explanation, guessing that the neuron is activating on
              <div style={{ backgroundColor: '#eeeeee', borderRadius: '10px', padding: '5px 10px' }}>
                {data.explanation}
              </div>
            </div>
          }
        </div>

        <div style={{ marginTop: '5px', marginBottom: '5px' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => setCurrentStep(1)}>
            <span style={{
              ...spanstyle, ...c({ faded: currentStep !== 1 }),
            }}>Step 2</span>
            <span style={headingstyle}><b>Simulate</b> activations using GPT-4, conditioning on the explanation</span>
          </div>
          {currentStep === 1 &&
            <div style={{ ...stepStyle }}>
              Assuming that the neuron activates on
              <div style={{ backgroundColor: '#eeeeee', borderRadius: '10px', padding: '5px 10px' }}>
                {data.explanation}
              </div>
              GPT-4 guesses how strongly the neuron responds at each token:
              <div style={{ padding: '5px 10px' }}>
                {data.score_sequences.map((expl_seq, i) => {
                  return <TokenHeatmap key={i} tokens={expl_seq.simulated} animate={true} />
                })}
              </div>
            </div>
          }
        </div>

        <div style={{ marginTop: '5px', marginBottom: '5px' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => setCurrentStep(2)}>
            <span style={{
              ...spanstyle, ...c({ faded: currentStep !== 2 }),
            }}>Step 3</span>
            <span style={headingstyle}><b>Score</b> the explanation by comparing the simulated and real activations</span>
          </div>
          {currentStep === 2 &&
            <div style={{ ...stepStyle }}>
              <div style={{ padding: '5px 10px' }}>
                <SimulationSequences
                  sequences={data.score_sequences.map(expl_seq => expl_seq.actual)}
                  simulated_sequences={data.score_sequences.map(expl_seq => expl_seq.simulated)}
                  overlay_activations={false}
                />
              </div>
              Comparing the simulated and real activations to see how closely they match,
              we derive a score:
              <div style={{ backgroundColor: '#eeeeee', borderRadius: '10px', padding: '5px 10px' }}>
                {parseFloat(data.score).toFixed(3)}
              </div>
            </div>
          }
        </div>
      </div>
      <div style={{ border: '#eeeeee 1px solid', borderRadius: '10px', width: '100%', padding: '10px' }}>
        <div style={{ alignItems: 'center', textAlign: 'center', marginBottom: '5px' }}>
          Select a neuron: {' '}
          <select style={{ width: '300px' }} value={currentIndex} onChange={(e) => { setCurrentIndex(parseInt(e.target.value)) }}>
            {CarouselData.map((d, i) => {
              return <option key={i} value={i}>{d.short_label}</option>
            })}
          </select>
        </div>
        <div style={{ lineHeight: '1.1em', color: 'black' }}>
          <a href={`https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/${data.layer}/neurons/${data.neuron}`}>
            Layer {data.layer} neuron {data.neuron}
          </a>: <em>{data.human_explanation}</em>
        </div>
      </div>
    </div>
  );
};
