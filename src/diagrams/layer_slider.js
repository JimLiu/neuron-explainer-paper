import React from 'react';
import ScoringToggleImage from './scoring_toggle'

export default () => {
  const n_layers = 48;

  const [layer, set_layer] = React.useState(0);

  return (
    <div>
      <div className="slidecontainer">
        Layer {layer} <input type="range" min={0} max={n_layers-1} value={layer} className="slider" id="myRange"
          onChange={(e) => set_layer(e.target.value)} />
      </div>
      <ScoringToggleImage 
          random_only_image={`./plots/explanation_score_hists/layer_${layer}.corr.random_only.png`}
          random_and_top_image={`./plots/explanation_score_hists/layer_${layer}.corr.all.png`}
      />
    </div>
  );
};
