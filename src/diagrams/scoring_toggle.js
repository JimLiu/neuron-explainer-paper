import React from 'react';

const ScoringToggleContext = React.createContext();

export const Provider = ({ children }) => {
  const [scoretype, set_scoretype] = React.useState('random_only');

  return (
    <ScoringToggleContext.Provider value={{ scoretype, set_scoretype }}>
      {children}
    </ScoringToggleContext.Provider>
  );
};

export default ({
  random_only_image,
  random_and_top_image,
}) => {
  const { scoretype, set_scoretype } = React.useContext(ScoringToggleContext);
  console.log('here', scoretype)

  return (
    <div>
      <div style={{ fontSize: 12, textAlign: 'center' }}>
        {/*
        <button onClick={() => set_scoretype('random_only')} disabled={scoretype==='random_only'}>Random Only</button>
        <button onClick={() => set_scoretype('random_and_top')} disabled={scoretype==='random_and_top'}>Random and Top</button>
toggle switch instead
          */}
        Random Only Scoring
        <label className="switch" style={{ margin: '0px 10px' }}>
          <input type="checkbox" checked={scoretype === 'random_and_top'} onChange={() => set_scoretype(scoretype === 'random_only' ? 'random_and_top' : 'random_only')} />
          <span className="toggleslider round"></span>
        </label>
        Top And Random Scoring

      </div>
      <img width='100%' src={scoretype === 'random_only' ? random_only_image : random_and_top_image} />
    </div>
  );
};
