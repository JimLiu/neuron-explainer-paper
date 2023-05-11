import React from 'react';


export default ({
  random_and_top_and_extra_image,
  random_and_top_image,
}) => {
  const [ scoretype, set_scoretype ] = React.useState("random_and_top");

  return (
    <div>
      <div style={{fontSize: 12, textAlign: 'center'}}>
            {/*
        <button onClick={() => set_scoretype('random_only')} disabled={scoretype==='random_only'}>Random Only</button>
        <button onClick={() => set_scoretype('random_and_top')} disabled={scoretype==='random_and_top'}>Random and Top</button>
toggle switch instead
          */}
        Top And Random Scoring
        <label className="switch" style={{margin: '0px 10px'}}>
          <input type="checkbox" checked={scoretype==='random_and_top_and_extra'} onChange={() => set_scoretype(scoretype==='random_and_top' ? 'random_and_top_and_extra' : 'random_and_top')} />
          <span className="toggleslider round"></span>
        </label>
        Top And Random and Generated Scoring
        
      </div>
      <img width='100%' src={scoretype === 'random_and_top' ? random_and_top_image : random_and_top_and_extra_image} />
    </div>
  );
};
